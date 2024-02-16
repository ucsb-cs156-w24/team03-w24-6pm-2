import React from 'react';
import UCSBDiningCommonsMenuItemsTable from 'main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsTable';
import { ucsbDiningCommonsMenuItemsFixtures } from 'fixtures/ucsbDiningCommonsMenuItemsFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsTable',
    component: UCSBDiningCommonsMenuItemsTable
};

const Template = (args) => {
    return (
        <UCSBDiningCommonsMenuItemsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    ucsbDiningCommonsMenuItems: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    ucsbDiningCommonsMenuItems: ucsbDiningCommonsMenuItemsFixtures.threeDiningCommonsMenuItems,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    ucsbDiningCommonsMenuItems: ucsbDiningCommonsMenuItemsFixtures.threeDiningCommonsMenuItems,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/ucsbdiningcommonsmenuitems', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};