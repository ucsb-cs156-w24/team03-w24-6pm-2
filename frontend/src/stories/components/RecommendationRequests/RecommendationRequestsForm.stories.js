import React from 'react';
import RecommendationRequestsForm from "main/components/RecommendationRequests/RecommendationRequestsForm"
import { recommendationRequestsFixtures} from 'fixtures/recommendationRequestsFixtures';

export default {
    title: 'components/RecommendationRequests/RecommendationRequestsForm',
    component: RecommendationRequestsForm
};

const Template = (args) => {
    return (
        <RecommendationRequestsForm {...args} />
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