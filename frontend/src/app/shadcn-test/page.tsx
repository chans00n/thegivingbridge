import { Button } from "@/components/ui/button";

export default function ShadcnTestPage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "App Name Not Set";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Shadcn/UI & .env Test Page</h1>
      <h2 style={{ marginBottom: "20px", color: "blue" }}>
        App Name: {appName}
      </h2>
      <p style={{ marginBottom: "20px" }}>
        If you see a styled button below, shadcn/ui is working!
      </p>
      <Button variant="destructive" size="lg">
        Test Button
      </Button>
      <Button variant="outline" className="mt-4">
        Another Test Button
      </Button>
    </div>
  );
}
