import ClientButton from "@/components/ClientButton";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <ClientButton message="Hello World" className="btn btn-soft">
        Primary
      </ClientButton>
    </div>
  );
}
