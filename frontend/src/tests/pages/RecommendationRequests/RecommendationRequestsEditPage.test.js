import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestsEditPage from "main/pages/RecommendationRequests/RecommendationRequestsEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";


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
        useParams: () => ({
            id: 1
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});


describe("RecommendationRequestsEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/recommendationrequests", { params: { id: 1 } }).reply(200,
                
                );
        });

    const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit RecommendationRequests");
            expect(screen.queryByTestId("RecommendationRequestsEdit-id")).not.toBeInTheDocument();
            restoreConsole();
        });
    });


    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/recommendationrequests", { params: { id: 1 } }).reply(200, {
            id: 1,
            requesterEmail: "cgaucho@ucsb.edu",
            professorEmail: "phtcon@ucsb.edu",
            explanation: "BS/MS Program",
            dateRequested: "2022-04-20T00:00:00",
            dateNeeded: "2022-05-01T00:00:00",
            done: "false"
            });
            axiosMock.onPut('/api/recommendationrequests').reply(200, {
                id: 1,
            requesterEmail: "cgaucho@ucsb.edu",
            professorEmail: "phtcon@ucsb.edu",
            Explanation: "CS PhD Stanford",
            dateRequested: "2022-04-20T00:00:00",
            dateNeeded: "2022-05-01T00:00:00",
            done: "false"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );


            await screen.findByTestId("RecommendationRequestsForm-id");

            const idField = screen.getByTestId("RecommendationRequestsForm-id");
            const requesterEmailField = screen.getByTestId("RecommendationRequestsForm-requesterEmail");
            const professorEmailField = screen.getByTestId("RecommendationRequestsForm-professorEmail");
            const explanationField = screen.getByTestId("RecommendationRequestsForm-explanation");
            const dateRequestedField = screen.getByTestId("RecommendationRequestsForm-dateRequested");
            const dateNeededField = screen.getByTestId("RecommendationRequestsForm-dateNeeded");
            const doneField = screen.getByTestId("RecommendationRequestsForm-done");
            const submitButton = screen.getByTestId("RecommendationRequestsForm-submit");

            expect(idField).toHaveValue("1");
            expect(requesterEmailField).toHaveValue("cgaucho@ucsb.edu");
            expect(professorEmailField).toHaveValue("phtcon@ucsb.edu");
            expect(explanationField).toHaveValue("BS/MS Program");
            expect(dateRequestedField).toHaveValue("2022-04-20T00:00");
            expect(dateNeededField).toHaveValue("2022-05-01T00:00");
            expect(doneField).toHaveValue("false");
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("RecommendationRequestsForm-id");

            const idField = screen.getByTestId("RecommendationRequestsForm-id");
            const requesterEmailField = screen.getByTestId("RecommendationRequestsForm-requesterEmail");
            const professorEmailField = screen.getByTestId("RecommendationRequestsForm-professorEmail");
            const explanationField = screen.getByTestId("RecommendationRequestsForm-explanation");
            const dateRequestedField = screen.getByTestId("RecommendationRequestsForm-dateRequested");
            const dateNeededField = screen.getByTestId("RecommendationRequestsForm-dateNeeded");
            const doneField = screen.getByTestId("RecommendationRequestsForm-done");
            const submitButton = screen.getByTestId("RecommendationRequestsForm-submit");

            expect(idField).toHaveValue("1");
            expect(requesterEmailField).toHaveValue("cgaucho@ucsb.edu");
            expect(professorEmailField).toHaveValue("phtcon@ucsb.edu");
            expect(explanationField).toHaveValue("BS/MS Program");
            expect(dateRequestedField).toHaveValue("2022-04-20T00:00");
            expect(dateNeededField).toHaveValue("2022-05-01T00:00");
            expect(doneField).toHaveValue("false");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(explanationField, { target: { value: "CS PhD Stanford" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("RecommendationRequests Updated - id: 1");
            expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequests" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 1 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                
                requesterEmail: "cgaucho@ucsb.edu",
                professorEmail: "phtcon@ucsb.edu",
                explanation: "CS PhD Stanford",
                dateRequested: "2022-04-20T00:00:00",
                dateNeeded: "2022-05-01T00:00:00",
                done: "false"
        })); // posted object

    });
        // assert

    });
});