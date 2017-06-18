/* eslint "react/prop-types": "warn" */
import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux';

import Sidebar from 'metabase/components/Sidebar.jsx';
import SidebarLayout from 'metabase/components/SidebarLayout.jsx';
import ReferenceGettingStartedGuide from "metabase/reference/containers/ReferenceGettingStartedGuide.jsx"

import * as metadataActions from 'metabase/redux/metadata';
import * as actions from 'metabase/reference/reference';

import {
    getDatabaseId,
    getSectionId,
    getSections,
    getSection,
    getBreadcrumbs,
    getIsEditing
} from '../selectors';

import {
    tryFetchData
} from '../utils';

import {
    loadEntities
} from 'metabase/questions/questions';

import {
    fetchDashboards
} from 'metabase/dashboards/dashboards';

const mapStateToProps = (state, props) => ({
    sectionId: getSectionId(state, props),
    databaseId: getDatabaseId(state, props),
    sections: getSections(state, props),
    section: getSection(state, props),
    breadcrumbs: getBreadcrumbs(state, props),
    isEditing: getIsEditing(state, props)
});

const mapDispatchToProps = {
    fetchQuestions: () => loadEntities("card", {}),
    fetchDashboards,
    ...metadataActions,
    ...actions
};

@connect(mapStateToProps, mapDispatchToProps)
export default class GettingStartedGuideContainer extends Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        breadcrumbs: PropTypes.array,
        location: PropTypes.object.isRequired,
        sections: PropTypes.object.isRequired,
        section: PropTypes.object.isRequired,
        isEditing: PropTypes.bool
    };

    async componentWillMount() {
        await tryFetchData(this.props);
    }

    async componentWillReceiveProps(newProps) {
        if (this.props.location.pathname === newProps.location.pathname) {
            return;
        }

        newProps.endEditing();
        newProps.endLoading();
        newProps.clearError();
        newProps.collapseFormula();

        await tryFetchData(newProps);
    }

    render() {
        const {
            section,
            sections,
            breadcrumbs,
            isEditing
        } = this.props;


        return (
                <ReferenceGettingStartedGuide {...this.props} />
        );
    }
}