import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RecommendationRequestsForm from "main/components/RecommendationRequests/RecommendationRequestsForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestsEditPage({storybook=false}) {
    let { id } = useParams();

    const { data: recommendationRequests, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/recommendationrequests?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/recommendationrequests`,
        params: {
          id
        }
      }
    );
      console.log(recommendationRequests?.id);
    const objectToAxiosPutParams = (recommendationRequests) => ({
        url: "/api/recommendationrequests",
        method: "PUT",
        params: {
          id: recommendationRequests.id,
        },
        data: {
          requesterEmail: recommendationRequests.requesterEmail,
          professorEmail: recommendationRequests.professorEmail,
          explanation: recommendationRequests.explanation,
          dateRequested: recommendationRequests.dateRequested,
          dateNeeded: recommendationRequests.dateNeeded,
          done: recommendationRequests.done,
        }
      });

      const onSuccess = (recommendationRequests) => {
        toast(`RecommendationRequests Updated - id: ${recommendationRequests.id}`);
      }

      const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/recommendationrequests?id=${id}`]
      );

      const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/recommendationrequests" />
  }
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit RecommendationRequests</h1>
        {
          recommendationRequests && <RecommendationRequestsForm initialContents={recommendationRequests} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )

}