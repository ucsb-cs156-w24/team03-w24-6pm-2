import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { recommendationRequestsFixtures} from "fixtures/recommendationRequestsFixtures";
import RecommendationRequestsTable from "main/components/RecommendationRequests/RecommendationRequestsTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";



const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("RecommendationRequestsTable tests", () => {
    const queryClient = new QueryClient();
  
    test("Has the expected column headers and content for ordinary user", () => {

        const currentUser = currentUserFixtures.userOnly;

     

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestsTable requests={recommendationRequestsFixtures.threeRecommendations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const expectedHeaders = ["id", "RequesterEmail", "ProfessorEmail", "Explanation", "DateRequested", "DateNeeded", "Done"];
    const expectedFields = ["id", "requesterEmail", "professorEmail", "explanation", "localDateTime", "localTimeDate", "done"];
    const testId = "RecommendationRequestsTable";
        console.log(recommendationRequestsFixtures.threeRecommendations);
    expectedHeaders.forEach((headerText) => {
        const header = screen.getByText(headerText);
        expect(header).toBeInTheDocument();
      });
  
      expectedFields.forEach((field) => {
        const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
        expect(header).toBeInTheDocument();
      });
  
      expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
      console.log(screen.getByTestId(`${testId}-cell-row-0-col-id`))
      expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
      

  
    });
  
    test("Has the expected colum headers and content for adminUser", () => {
  
      const currentUser = currentUserFixtures.adminUser;

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestsTable requests={recommendationRequestsFixtures.threeRecommendations} currentUser={currentUser} />
          </MemoryRouter>
        </QueryClientProvider>
  
      );


        const expectedHeaders = ["id", "RequesterEmail", "ProfessorEmail", "Explanation", "DateRequested", "DateNeeded", "Done"];
    const expectedFields = ["id", "requesterEmail", "professorEmail", "explanation", "localDateTime", "localTimeDate", "done"];
    const testId = "RecommendationRequestsTable";

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
          });
      
          expectedFields.forEach((field) => {
            const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
          });

          expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
            expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");

            const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
            expect(editButton).toBeInTheDocument();
            expect(editButton).toHaveClass("btn-primary");

            const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
            expect(deleteButton).toBeInTheDocument();
            expect(deleteButton).toHaveClass("btn-danger");

        });

        test("Edit button navigates to the edit page for admin user", async () => {

            const currentUser = currentUserFixtures.adminUser;
        
            render(
              <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                  <RecommendationRequestsTable requests={recommendationRequestsFixtures.threeRecommendations} currentUser={currentUser} />
                </MemoryRouter>
              </QueryClientProvider>
        
            );

            await waitFor(() => { expect(screen.getByTestId(`RecommendationRequestsTable-cell-row-0-col-id`)).toHaveTextContent("1"); });

            const editButton = screen.getByTestId(`RecommendationRequestsTable-cell-row-0-col-Edit-button`);
            expect(editButton).toBeInTheDocument();
            
            fireEvent.click(editButton);

            await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/recommendationrequests/edit/1'));

        });

        test("Delete button calls delete callback", async () => {
            // arrange
            const currentUser = currentUserFixtures.adminUser;
            const testId = "RecommendationRequestsTable";
        
            // act - render the component
            render(
              <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                  <RecommendationRequestsTable requests={recommendationRequestsFixtures.threeRecommendations} currentUser={currentUser} />
                </MemoryRouter>
              </QueryClientProvider>
            );
        
            // assert - check that the expected content is rendered
            expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
            expect(screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`)).toHaveTextContent("ldelplaya@ucsb.edu");
        
            // const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
            // expect(deleteButton).toBeInTheDocument();
            const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
            expect(editButton).toBeInTheDocument();
            expect(editButton).toHaveClass("btn-primary");
        
            const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
            expect(deleteButton).toBeInTheDocument();
            expect(deleteButton).toHaveClass("btn-danger");
            // act - click the delete button
            fireEvent.click(deleteButton);
          });

          test("Edit and Delete buttons are not present for non-admin users", async () => {
            // arrange
            const currentUser = currentUserFixtures.userOnly; // assuming this user does not have ROLE_ADMIN
            const testId = "RecommendationRequestsTable";
            
            // act - render the component with a non-admin user
            render(
              <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                  <RecommendationRequestsTable requests={recommendationRequestsFixtures.threeRecommendations} currentUser={currentUser} />
                </MemoryRouter>
              </QueryClientProvider>
            );
            
            // assert - check that the Edit and Delete buttons are not rendered
            const editButton = screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`);
            expect(editButton).not.toBeInTheDocument();
            
            const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
            expect(deleteButton).not.toBeInTheDocument();
          });

        });
        