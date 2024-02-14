import React from 'react';
import RecommendationRequestForm from "main/components/RecommendationRequests/RecommendationRequestsForm"
import { recommendationRequestsFixtures, restaurantFixtures } from 'fixtures/recommendationRequestsFixtures';

export default {
    title: 'components/RecommendationRequests/RecommendationRequestsForm',
    component: RecommendationRequestForm
};

const Template = (args) => {
    return (
        <RecommendationRequestForm {...args} />
    )
};

export const Create = Template.bind({});

Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
         console.log("Submit was clicked with data: ", data); 
         window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
};

export const Update = Template.bind({});

Update.args = {
    initialContents: recommendationRequestsFixtures.oneRecommendation[0],
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};