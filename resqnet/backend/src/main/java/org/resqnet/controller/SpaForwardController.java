package org.resqnet.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping(value = {
            "/",
            "/login",
            "/register",
            "/track",
            "/shelters",
            "/analytics",
            "/citizen",
            "/responder",
            "/admin"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
