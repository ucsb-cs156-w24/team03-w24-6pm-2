import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import RecommendationRequestsForm from "main/components/RecommendationRequests/RecommendationRequestsForm";
import { recommendationRequestsFixtures } from "fixtures/recommendationRequestsFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("RecommendationRequestsForm tests", () => {
    test("renders correctly", async () => {

        render(
            <Router  >
                <RecommendationRequestsForm />
            </Router>
        );
        await screen.findByText(/Requester Email/);
        await screen.findByText(/Create/);
    });

    test("renders correctly when passing in a RecommendationRequest", async () => {

        render(
            <Router  >
                <RecommendationRequestsForm initialContents={recommendationRequestsFixtures.oneRecommendation} />
            </Router>
        );
        await screen.findByTestId(/RecommendationRequestsForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/RecommendationRequestsForm-id/)).toHaveValue("1");
    });

    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <Recomm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestsForm-requesterEmail");
        const requesterEmailField = screen.getByTestId("RecommendationRequestsForm-requesterEmail");
        const professorEmailField = screen.getByTestId("RecommendationRequestsForm-professorEmail");
        const explanationField = screen.getByTestId("RecommendationRequestsForm-explanation");
        const dateRequestedField = screen.getByTestId("RecommendationRequestsForm-dateRequested");
        const dateNeededField = screen.getByTestId("RecommendationRequestsForm-dateNeeded");
        const doneField = screen.getByTestId("RecommendationRequestsForm-done");
        const submitButton = screen.getByTestId("RecommendationRequestsForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(professorEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(explanationField, { target: { value: 'bad-input' } });
        fireEvent.change(dateRequestedField, { target: { value: 'bad-input' } });
        fireEvent.change(dateNeededField, { target: { value: 'bad-input' } });
        fireEvent.change(doneField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        //await screen.findByText(/QuarterYYYYQ must be in the format YYYYQ/);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <RecommendationRequestsForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestsForm-submit");
        const submitButton = screen.getByTestId("RecommendationRequestsForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/RequesterEmail is required./);
        expect(screen.getByText(/ProfessorEmail is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/DateRequested is required./)).toBeInTheDocument();
        expect(screen.getByText(/DateNeeded is required./)).toBeInTheDocument();
        expect(screen.getByText(/Done is required./)).toBeInTheDocument();

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
        const doneField = screen.getByTestId("RecommendationRequestsForm-done");
        const submitButton = screen.getByTestId("RecommendationRequestsForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'cgaucho@ucsb.edu' } });
        fireEvent.change(professorEmailField, { target: { value: 'phtcon@ucsb.edu' } });
        fireEvent.change(explanationField, { target: { value: 'BS/MS Program' } });
        fireEvent.change(dateRequestedField, { target: { value: '2022-04-20T00:00:00' } });
        fireEvent.change(dateNeededField, { target: { value: '2022-05-01T00:00:00' } });
        fireEvent.change(doneField, { target: { value: 'false' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        //expect(screen.queryByText(/QuarterYYYYQ must be in the format YYYYQ/)).not.toBeInTheDocument();
        expect(screen.queryByText(/dateRequested must be in ISO format/)).not.toBeInTheDocument();
        expect(screen.queryByText(/dateNeeded must be in ISO format/)).not.toBeInTheDocument();
        
        

    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <RecommendationRequestsForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestsForm-cancel");
        const cancelButton = screen.getByTestId("RecommendationRequestsForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});