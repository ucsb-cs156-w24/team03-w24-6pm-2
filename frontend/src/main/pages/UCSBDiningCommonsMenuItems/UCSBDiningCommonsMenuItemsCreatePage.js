import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemsForm from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemsCreatePage({storybook=false}) {

  const objectToAxiosParams = (ucsbDiningCommonsMenuItems) => ({
    url: "/api/ucsbdiningcommonsmenuitems/post",
    method: "POST",
    params: {
     diningCommonsCode: ucsbDiningCommonsMenuItems.diningCommonsCode,
     name: ucsbDiningCommonsMenuItems.name,
     station: ucsbDiningCommonsMenuItems.station
    }
  });

  const onSuccess = (ucsbDiningCommonsMenuItems) => {
    toast(`New UCSBDiningCommonsMenuItems Created - id: ${ucsbDiningCommonsMenuItems.id} diningCommonsCode: ${ucsbDiningCommonsMenuItems.diningCommonsCode}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/ucsbdiningcommonsmenuitems/all"] // mutation makes this key stale so that pages relying on it reload
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsbdiningcommonsmenuitems" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSBDiningCommonsMenuItems</h1>
        <UCSBDiningCommonsMenuItemsForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
