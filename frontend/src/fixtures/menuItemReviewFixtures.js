const menuItemReviewFixtures = {
    oneReview: {
        "id": 7,
        "diningCommonsCode": "ortega",
        "name": "Apple Pie",
        "station" : "Desserts"
      },
    threeReviews: [
        {
            "id": 7,
            "diningCommonsCode": "ortega",
            "name": "Apple Pie",
            "station" : "Desserts"
        },
        {
            "id": 47,
            "itemId": 7,
            "reviewerEmail" : "cgaucho@ucsb.edu",
            "stars": 5,
            "comments": "I love the Apple Pie"
        },
        {
            "id": 53,
            "itemId": 7,
            "reviewerEmail" : "ldelplaya@ucsb.edu",
            "stars": 0,
            "comments": "I hate the Apple Pie"
        }
    ]
};


export { menuItemReviewFixtures };