import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import './index.css';
// import App from './App';


import {
  Outlet,
  RouterProvider,
  Link,
  Router,
  Route,
  RootRoute,
} from '@tanstack/router'

// Create a root route
const rootRoute = new RootRoute({
  component: Root,
})

function Root() {
  return (
    <>
      <div>
        <Link to="/">Home</Link> <Link to="/about">About</Link>
      </div>
      <hr />
      <Outlet />
    </>
  )
}

// Create an index route
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
})

function Index() {
  return (
    <div>
      <h3>Welcome Home!</h3>
    </div>
  )
}

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
})

function About() {
  return <div>Hello from About!</div>
}

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([indexRoute, aboutRoute])

// Create the router using your route tree
const router = new Router({ routeTree })

// Register your router for maximum type safety
declare module '@tanstack/router' {
  interface Register {
    router: typeof router
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    // <App />
    <RouterProvider router={router} />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
