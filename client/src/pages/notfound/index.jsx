import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-6">
        <p className="text-sm font-medium text-muted-foreground">
          Page not found
        </p>

        <h1 className="text-8xl font-bold tracking-tight">404</h1>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            Oops! We can't find that page.
          </h2>

          <p className="text-muted-foreground max-w-md">
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        <Button asChild>
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
