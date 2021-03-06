import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import {
    ExtensionActions,
    VisiblePanelActions,
    InstallationActions
} from "actions";
import Localization from "localization";
import GridCell from "dnn-grid-cell";
import ExtensionList from "./ExtensionList";
import DropdownWithError from "dnn-dropdown-with-error";
import "./style.less";

class AvailableExtensions extends Component {
    constructor() {
        super();
        this.state = {
            doingOperation: false
        };
    }
    checkIfAvailablePackageTypesEmpty(props) {
        return !props.availablePackageTypes || props.availablePackageTypes.length === 0;
    }

    checkIfAvailablePackagesEmpty(props) {
        return !props.availablePackages || props.availablePackages.length === 0;
    }
    componentWillMount() {
        const { props } = this;
        if (!this.checkIfAvailablePackageTypesEmpty(props) && this.checkIfAvailablePackagesEmpty(props) && props.selectedAvailablePackageType === "") {
            props.dispatch(ExtensionActions.getAvailablePackages(props.availablePackageTypes[0].Type));
        }
    }

    onChange(key, event) {
        this.setState({
            [key]: event.target.value
        });
    }

    onSelectChange(option) {
        this.setState({
            selectValue: option.value
        });
    }
    onFilterSelect(option) {
        const {props} = this;
        props.dispatch(ExtensionActions.getAvailablePackages(option.value));
    }

    onInstall(name, event) {
        if (event) {
            event.preventDefault();
        }
        const {props} = this;
        this.setDoingOperation(true);
        props.dispatch(ExtensionActions.parseAvailablePackage(name, props.selectedAvailablePackageType, () => {
            this.setDoingOperation(false);
            props.dispatch(InstallationActions.setInstallingAvailablePackage(name, props.selectedAvailablePackageType, () => {
                props.dispatch(InstallationActions.navigateWizard(1, () => {
                    props.dispatch(VisiblePanelActions.selectPanel(3));
                }));
            }));
        }));
    }

    setDoingOperation(doingOperation) {
        this.setState({
            doingOperation
        });
    }

    onDeploy(index, _package, event) {
        if (event) {
            event.preventDefault();
        }
        const {props} = this;

        this.setDoingOperation(true);
        props.dispatch(ExtensionActions.deployAvailablePackage(_package, index, (data) => {
            props.dispatch(ExtensionActions.getAvailablePackages(props.selectedAvailablePackageType, () => {
                let packageToInstall = this.props.availablePackages.find((_package)=>{
                    return _package.name === data.name;
                });
                this.onInstall(packageToInstall.fileName);
            }));
        }));
    }

    render() {
        const {props} = this;
        return (
            <GridCell className="extension-list">
                <GridCell className="collapse-section">
                    <DropdownWithError className="filter-dropdown" onSelect={this.onFilterSelect.bind(this)} options={props.availablePackageTypes && props.availablePackageTypes.map((_package) => {
                        return {
                            label: _package.DisplayName,
                            value: _package.Type
                        };
                    })}
                        label={Localization.get("Showing.Label")}
                        value={props.selectedAvailablePackageType}
                        labelType="inline" />
                </GridCell>

                {(props.availablePackages && props.availablePackages.length > 0) &&
                    <ExtensionList
                        packages={props.availablePackages}
                        doingOperation={this.state.doingOperation}
                        type={props.selectedAvailablePackageType}
                        onInstall={this.onInstall.bind(this)}
                        onDeploy={this.onDeploy.bind(this)} />
                }
            </GridCell>
        );
    }
}

AvailableExtensions.propTypes = {
    dispatch: PropTypes.func.isRequired,
    availablePackages: PropTypes.array,
    tabIndex: PropTypes.number
};

function mapStateToProps(state) {
    return {
        availablePackageTypes: state.extension.availablePackageTypes,
        availablePackages: state.extension.availablePackages,
        selectedAvailablePackageType: state.extension.selectedAvailablePackageType,
        tabIndex: state.pagination.tabIndex
    };
}

export default connect(mapStateToProps)(AvailableExtensions);