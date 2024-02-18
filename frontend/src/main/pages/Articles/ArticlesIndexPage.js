import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

export default function ArticlesIndexPage() {

  // Stryker disable all : articles for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Index page not yet implemented</h1>
        <p><a href="/Articles/create">Create</a></p>
        <p><a href="/Articles/edit/1">Edit</a></p>
      </div>
    </BasicLayout>
  )
}
