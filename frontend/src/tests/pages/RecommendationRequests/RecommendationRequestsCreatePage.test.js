import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestsCreatePage from "main/pages/RecommendationRequests/RecommendationRequestsCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("RecommendationRequestsCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const recommendationRequests = {
            id: 1,
            requesterEmailField: "cgaucho@ucsb.edu",
            professorEmailField: "phtcon@ucsb.edu",
            explanationField: "MS/BS Program",
            dateRequested: "2022-04-20T00:00:00",
            dateNeeded: "2022-05-01T00:00:00",
            doneField: "false"
        };

        axiosMock.onPost("/api/recommendationrequests/post").reply( 202, recommendationRequests );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("RecommendationRequestsForm-requesterEmail")).toBeInTheDocument();
        });

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

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "done": "false",
            "dateRequested": "2022-04-20T00:00:00",
            "dateNeeded": "2022-05-01T00:00:00",
            "explanation": "BS/MS Program",
            "professorEmail": "phtcon@ucsb.edu",
            "requesterEmail": "cgaucho@ucsb.edu"
        });

        expect(mockToast).toBeCalledWith("New recommendationRequests Created - id: 1 requesterEmail: cgaucho@ucsb.edu");
        expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequests" });
    });

});
