import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestsTable from 'main/components/RecommendationRequests/RecommendationRequestsTable';
import { Button } from 'react-bootstrap';
import { useCurrentUser , hasRole} from 'main/utils/currentUser';

export default function RecommendationRequestsIndexPage() {

    const currentUser = useCurrentUser();
  
    const createButton = () => {
      if (hasRole(currentUser, "ROLE_ADMIN")) {
          return (
              <Button
                  variant="primary"
                  href="/recommendationrequests/create"
                  style={{ float: "right" }}
              >
                  Create RecommendationRequest
              </Button>
          )
      } 
    }

    const { data: requests, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/recommendationrequests/all"],
      { method: "GET", url: "/api/recommendationrequests/all" },
      []
    );

    return (
        <BasicLayout>
          <div className="pt-2">
            {createButton()}
            <h1>RecommendationRequests</h1>
            <RecommendationRequestsTable requests={requests} currentUser={currentUser} />
          </div>
        </BasicLayout>
      )
}
