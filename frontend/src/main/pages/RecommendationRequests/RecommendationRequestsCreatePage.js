import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestsForm from "main/components/RecommendationRequests/RecommendationRequestsForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";


export default function RecommendationRequestsCreatePage({storybook=false}) {

    const objectToAxiosParams = (recommendationRequests) => ({
        url: "/api/recommendationrequests/post",
        method: "POST",
        params: {
          requesterEmail: recommendationRequests.requesterEmail,
          professorEmail: recommendationRequests.professorEmail,
          explanation: recommendationRequests.explanation,
          dateRequested: recommendationRequests.localDateTime,
          dateNeeded: recommendationRequests.localTimeDate,
          done: recommendationRequests.done

        }
      });

      const onSuccess = (recommendationRequests) => {
        toast(`New recommendationRequest Created - id: ${recommendationRequests.id} name: ${recommendationRequests.requesterEmail}`);
      }

      const mutation = useBackendMutation(
        objectToAxiosParams,
         { onSuccess }, 
         // Stryker disable next-line all : hard to set up test for caching
         ["/api/recommendationrequests/all"]
         );

        const { isSuccess } = mutation

            const onSubmit = async (data) => {
                mutation.mutate(data);
            }

            if (isSuccess && !storybook) {
                return <Navigate to="/recommendationrequests" />
            }

  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New RecommendationRequests</h1>

        <RecommendationRequestsForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}
