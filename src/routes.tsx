import type { RouteObject } from "react-router-dom";
import { Navbar } from "./components/Navbar";

// Layout component that includes navigation
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
    </>
  );
}

function HomePage() {
  return (
    <div>
      <h1>Welcome to CV Maker</h1>
      <p>Create your professional CV with ease!</p>
    </div>
  );
}

function AboutPage() {
  return (
    <div>
      <h1>About</h1>
      <p>This is a CV maker application built with React and React Router.</p>
    </div>
  );
}

function ContactPage() {
  return (
    <div>
      <h1>Contact</h1>
      <p>Get in touch with us for support or feedback.</p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

// Define your routes using RouteObject type
export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
  },
  {
    path: "/about",
    element: (
      <Layout>
        <AboutPage />
      </Layout>
    ),
  },
  {
    path: "/contact",
    element: (
      <Layout>
        <ContactPage />
      </Layout>
    ),
  },
  {
    path: "*",
    element: (
      <Layout>
        <NotFoundPage />
      </Layout>
    ),
  },
]; 