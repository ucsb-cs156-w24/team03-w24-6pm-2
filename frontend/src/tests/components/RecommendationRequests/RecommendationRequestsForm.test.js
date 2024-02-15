import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import RecommendationRequestForm from "main/components/RecommendationRequests/RecommendationRequestsForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestsFixtures";

import { QueryClient, QueryClientProvider } from "react-query";


const mockedNavigate = jest.fn();


jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
   useNavigate: () => mockedNavigate
}));


describe("RecommendationRequestsForm tests", () => {
   const queryClient = new QueryClient();


   const expectedHeaders = ["RequesterEmail", "ProfessorEmail", "Explanation", "DateRequested", "DateNeeded"];
   const testId = "RecommendationRequestsForm";


   test("renders correctly with no initialContents", async () => {
       render(
           <QueryClientProvider client={queryClient}>
               <Router>
                   <RecommendationRequestsForm />
               </Router>
           </QueryClientProvider>
       );


       expect(await screen.findByText(/Create/)).toBeInTheDocument();


       expectedHeaders.forEach((headerText) => {
           const header = screen.getByText(headerText);
           expect(header).toBeInTheDocument();
       });

       expect(screen.getAllByTestId(`${testId}-requesterEmail`)).toBeInTheDocument();
       expect(screen.getAllByTestId(`${testId}-professorEmail`)).toBeInTheDocument();
       expect(screen.getAllByTestId(`${testId}-explanation`)).toBeInTheDocument();
       expect(screen.getAllByTestId(`${testId}-dateRequested`)).toBeInTheDocument();
       expect(screen.getAllByTestId(`${testId}-dateNeeded`)).toBeInTheDocument();

   });


   test("renders correctly when passing in initialContents", async () => {
       render(
           <QueryClientProvider client={queryClient}>
               <Router>
                   <RecommendationRequestsForm initialContents={recommendationRequestsFixtures.oneRecommendation}/>
               </Router>
           </QueryClientProvider>
       );

       expect(await screen.findByText(/Create/)).toBeInTheDocument();

       expectedHeaders.forEach((headerText) => {
           const header = screen.getByText(headerText);
           expect(header).toBeInTheDocument();
       });


       expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
       expect(screen.getByTestId(`${testId}-requesterEmail`).value).toBe("cgaucho@ucsb.edu");

   });


   test("Correct Error messsages on missing input", async () => {

    render(
        <Router>
            <RecommendationRequestsForm />
        </Router>
    );
        await screen.findByTestId("RecommendationRequestsForm-submit");
        const submitButton = screen.getByTestId("RecommendationRequestsForm-submit");

        fireEvent.click(submitButton);

        expect(await screen.findByText(/RequesterEmail is required./)).toBeInTheDocument();
        expect(await screen.findByText(/ProfessorEmail is required./)).toBeInTheDocument();
        expect(await screen.findByText(/Explanation is required./)).toBeInTheDocument();
        expect(await screen.findByText(/DateRequested is required./)).toBeInTheDocument();
        expect(await screen.findByText(/DateNeeded is required./)).toBeInTheDocument();
    });


   test("No Error messsages on good input", async () => {

       const mockSubmitAction = jest.fn();

       render(
           <Router  >
               <RecommendationRequestsForm submitAction={mockSubmitAction} />
           </Router>
       );
       await screen.findByTestId("RecommendationRequestsForm-requesterEmail");

       const requesterEmailField = screen.getByTestId("RecommendationRequestsForm-requesterEmail");
       const professorEmailField = screen.getByTestId("RecommendationRequestsForm-professorEmail");
       const explanationField = screen.getByTestId("RecommendationRequestsForm-explanation");
       const dateRequestedField = screen.getByTestId("RecommendationRequestsForm-dateRequested");
       const dateNeededField = screen.getByTestId("RecommendationRequestsForm-dateNeeded");

       const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

       fireEvent.change(requesterEmailField, { target: { value: 'cgaucho@ucsb.edu' } });
       fireEvent.change(professorEmailField, { target: { value: 'phtcon@ucsb.edu' } });
       fireEvent.change(explanation, { target: { value: 'BS/MS program' } });
       fireEvent.change(dateRequestedField, { target: { value: '2022-01-02T12:00' } });
       fireEvent.change(dateNeededField, { target: { value: '2022-01-02T12:00' } });
       fireEvent.click(submitButton);

       await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

       expect(screen.queryByText(/dateRequested must be in ISO format/)).not.toBeInTheDocument();
       expect(screen.queryByText(/dateNeeded must be in ISO format/)).not.toBeInTheDocument();

   });


   test("that navigate(-1) is called when Cancel is clicked", async () => {
       render(
           <QueryClientProvider client={queryClient}>
               <Router>
                   <RecommendationRequestsForm />
               </Router>
           </QueryClientProvider>
       );
       expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
       const cancelButton = screen.getByTestId(`${testId}-cancel`);

       fireEvent.click(cancelButton);

       await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
   });

   test("that the correct validations are performed", async () => {
    render(
        <QueryClientProvider client={queryClient}>
            <Router>
                <RecommendationRequestsForm />
            </Router>
        </QueryClientProvider>
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByTestId(`${testId}-submit`);
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Requester Email is required/)).toBeInTheDocument();
    expect(await screen.findByText(/Professor Email is required/)).toBeInTheDocument();
    expect(await screen.findByText(/Explanation is required/)).toBeInTheDocument();
    expect(await screen.findByText(/DateRequested is required/)).toBeInTheDocument();
    expect(await screen.findByText(/DateNeeded is required/)).toBeInTheDocument();
});


});