import { Head } from "@inertiajs/react";

export default function CompaniesIndex({ companies }: any) {
  return (
    <>
      <Head title="Companies" />
      <div className="p-6">
        <h1 className="text-xl font-semibold">Companies</h1>
        <pre className="mt-4 text-sm bg-muted p-4 rounded">{JSON.stringify(companies, null, 2)}</pre>
      </div>
    </>
  );
}
