import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBDiningCommonsMenuItemsEditPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsEditPage";

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
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBDiningCommonsMenuItemsEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbdiningcommonsmenuitems", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit UCSBDiningCommonsMenuItems");
            expect(screen.queryByTestId("UCSBDiningCommonsMenuItems-diningCommonsCode")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/ucsbdiningcommonsmenuitems", { params: { id: 17 } }).reply(200, {
                id: 1,
                diningCommonsCode: 'carillo',
                name: "Pizza",
                description: "Pizza Station"
            });
            axiosMock.onPut('/api/ucsbdiningcommonsmenuitems').reply(200, {
                id: "1",
                diningCommonsCode: 'portola',
                name: "Pasta",
                description: "Pasta Station"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-id");

            const idField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-id");
            const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode");
            const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-name");
            const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-station");
            const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("1");
            expect(diningCommonsCodeField).toBeInTheDocument();
            expect(diningCommonsCodeField).toHaveValue("carillo");
            expect(nameField).toBeInTheDocument();
            expect(nameField).toHaveValue("Pizza");
            // expect(stationField).toBeInTheDocument();
            // expect(stationField).toHaveValue("Pizza Station");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(diningCommonsCodeField, { target: { value: 'portola' } });
            fireEvent.change(nameField, { target: { value: 'Pasta' } });
            fireEvent.change(stationField, { target: { value: 'Pasta Station' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBDiningCommonsMenuItems Updated - id: 1 diningCommonsCode: portola");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsbdiningcommonsmenuitems" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 1 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                diningCommonsCode: 'portola',
                name: 'Pasta',
                station: 'Pasta Station'
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-id");

            const idField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-id");
            const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode");
            const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-name");
            const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-station");
            const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");

            expect(idField).toHaveValue("1");
            expect(diningCommonsCodeField).toHaveValue("carillo");
            expect(nameField).toHaveValue("Pizza");
            // expect(stationField).toHaveValue("Pizza Station");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(diningCommonsCodeField, { target: { value: 'portola' } });
            fireEvent.change(nameField, { target: { value: 'Pasta' } });
            fireEvent.change(stationField, { target: { value: 'Pasta Station' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBDiningCommonsMenuItems Updated - id: 1 diningCommonsCode: portola");
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsbdiningcommonsmenuitems" });
        });

       
    });
});