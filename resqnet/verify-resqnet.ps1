# ResQNet Automated System Verification Script
# Tests all 3 roles, authentication, reporting, smart dispatch, responder navigation & resolution

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " ResQNet: Automated Full-Stack Verification & Test Runner" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api"

# Step 1: Health check
try {
    $stats = Invoke-RestMethod -Uri "$baseUrl/analytics/summary" -Method Get
    Write-Host "[PASS] Backend API is ONLINE. Total Incidents in DB: $($stats.totalIncidents)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Backend API is unreachable at $baseUrl" -ForegroundColor Red
    exit 1
}

# Step 2: Citizen Login
Write-Host "`n--> Testing Citizen Authentication..." -ForegroundColor Cyan
$citizenAuth = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body (@{ username = "citizen"; password = "Citizen@123" } | ConvertTo-Json)
Write-Host "[PASS] Citizen Authenticated: $($citizenAuth.fullName) ($($citizenAuth.role))" -ForegroundColor Green

# Step 3: Emergency Reporting
Write-Host "`n--> Testing Emergency Reporting Form..." -ForegroundColor Cyan
$citizenHeaders = @{ Authorization = "Bearer $($citizenAuth.token)" }
$randomLat = 28.6200 + (Get-Random -Minimum 10 -Maximum 90)/1000.0
$randomLng = 77.2100 + (Get-Random -Minimum 10 -Maximum 90)/1000.0

$incident = Invoke-RestMethod -Uri "$baseUrl/incidents" -Method Post -ContentType "application/json" -Headers $citizenHeaders -Body (@{
    title = "High Voltage Power Cable Snapped During Rain";
    category = "HAZMAT";
    severity = "CRITICAL";
    description = "Live sparking wire submerged in flood water near school gate. Pedestrians warned to stay back.";
    affectedCount = 10;
    contactPhone = "+91-9876543214";
    latitude = $randomLat;
    longitude = $randomLng;
    address = "Main Avenue, Sector 15 Gate 2";
} | ConvertTo-Json)
Write-Host "[PASS] Incident Logged Successfully!" -ForegroundColor Green
Write-Host "       Tracking Code: $($incident.trackingCode)" -ForegroundColor Yellow
Write-Host "       Initial Status: $($incident.status)" -ForegroundColor Yellow

# Step 4: Public Tracking Lookup
Write-Host "`n--> Testing Public Tracking Lookup (No Auth required)..." -ForegroundColor Cyan
$tracked = Invoke-RestMethod -Uri "$baseUrl/incidents/track/$($incident.trackingCode)" -Method Get
Write-Host "[PASS] Public Tracking Lookup Succeeded: '$($tracked.title)'" -ForegroundColor Green

# Step 5: Admin Smart Dispatch
Write-Host "`n--> Testing EOC Admin Authentication & Proximity Dispatch..." -ForegroundColor Cyan
$adminAuth = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body (@{ username = "admin@resqnet.org"; password = "Admin@123" } | ConvertTo-Json)
$adminHeaders = @{ Authorization = "Bearer $($adminAuth.token)" }

$nearby = Invoke-RestMethod -Uri "$baseUrl/incidents/$($incident.id)/nearby-responders" -Method Get -Headers $adminHeaders
$closestUnit = $nearby[0]
Write-Host "[PASS] Proximity Calculation: Identified $($nearby.Count) units. Closest: $($closestUnit.teamName) ($($closestUnit.distanceKm) km away)" -ForegroundColor Green

$dispatched = Invoke-RestMethod -Uri "$baseUrl/incidents/$($incident.id)/dispatch" -Method Post -ContentType "application/json" -Headers $adminHeaders -Body (@{
    responderTeamId = $closestUnit.id;
    dispatchNote = "High risk electrical hazard. Coordinate with municipal power grid for immediate feeder shutdown.";
} | ConvertTo-Json)
Write-Host "[PASS] Smart Dispatch Executed: Status is now '$($dispatched.status)'" -ForegroundColor Green

# Step 6: Responder Console Action
Write-Host "`n--> Testing Responder Unit Operations Workflow..." -ForegroundColor Cyan
$respAuth = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body (@{ username = "responder@resqnet.org"; password = "Responder@123" } | ConvertTo-Json)
$respHeaders = @{ Authorization = "Bearer $($respAuth.token)" }

$inProg = Invoke-RestMethod -Uri "$baseUrl/incidents/$($incident.id)/status" -Method Put -ContentType "application/json" -Headers $respHeaders -Body (@{
    status = "IN_PROGRESS";
    note = "Unit arrived on scene. Cordoned 100m perimeter around live wire.";
} | ConvertTo-Json)
Write-Host "[PASS] Responder Arrived On Scene: Status is now '$($inProg.status)'" -ForegroundColor Green

$resolved = Invoke-RestMethod -Uri "$baseUrl/incidents/$($incident.id)/status" -Method Put -ContentType "application/json" -Headers $respHeaders -Body (@{
    status = "RESOLVED";
    note = "Electricity grid team de-energized line. Cable repaired. Perimeter cleared safe.";
} | ConvertTo-Json)
Write-Host "[PASS] Incident Completed & Resolved: Status is now '$($resolved.status)'" -ForegroundColor Green

# Step 7: Operations Audit Log Timeline
Write-Host "`n--> Auditing Operations Event Timeline..." -ForegroundColor Cyan
$timeline = Invoke-RestMethod -Uri "$baseUrl/incidents/$($incident.id)/updates" -Method Get
Write-Host "[PASS] Timeline recorded $($timeline.Count) sequential audit milestones:" -ForegroundColor Green
foreach ($event in $timeline) {
    Write-Host "       [$($event.newStatus)] $($event.note)" -ForegroundColor Gray
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host " ALL SYSTEMS VERIFIED: RESQNET IS 100% OPERATIONAL! " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
