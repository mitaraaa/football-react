import { RootRoute, Route, Router } from "@tanstack/react-router";
import { Field, Fields, Home, Login, Signup } from "./pages";

const rootRoute = new RootRoute();

const indexRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Home,
});

const loginRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "login",
    component: Login,
});

const signupRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "signup",
    component: Signup,
});

const fieldsRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "fields",
});

const fieldsIndexRoute = new Route({
    getParentRoute: () => fieldsRoute,
    path: "/",
    component: Fields,
});

const fieldRoute = new Route({
    getParentRoute: () => fieldsRoute,
    path: "$fieldId",
    component: Field,
});

const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    signupRoute,
    fieldsRoute.addChildren([fieldsIndexRoute, fieldRoute]),
]);

const router = new Router({ routeTree, defaultPreload: "intent" });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

export { router };
