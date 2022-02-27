function ErrorPage() {
  return (
    <div className="flex items-center justify-center h-[95vh] w-full bg-gray-300">
      <div className="flex flex-col text-center bg-gray-200 p-8">
        <p className="p-2">An unfortunate error has ocurred :/</p>
        <p className="p-2"> We apologize for the inconvenience</p>
      </div>
    </div>
  );
}

export default ErrorPage;
