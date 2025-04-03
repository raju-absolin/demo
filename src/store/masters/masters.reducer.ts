import { combineReducers } from "@reduxjs/toolkit";
import departmentSlice from "./Department/department.slice";
import stateSlice from "./State/state.slice";
import countrySlice from "./Country/country.slice";
import citySlice from "./City/city.slice";
import locationSlice from "./Locations/location.slice";
import baseunitSlice from "./BaseUnit/baseunit.slice";
import mocSlice from "./Moc/moc.slice";
import makeSlice from "./Make/make.slice";
import vendorsSlice from "./Vendors/vendors.slice";
import itemgroupSlice from "./ItemGroup/itemgroup.slice";
import customersSlice from "./Customers/customer.slice";
import itemsSlice from "./Item/item.slice";
import taxSlice from "./Tax/tax.slice";
import categorySlice from "./Category/category.slice";
import documentSlice from "./Document/document.slice";
import companySlice from "./Company/company.slice";
import bidnatureSlice from "./BidNature/bidnature.slice";
import stageSlice from "./Stages/stages.slice";
import warehouseSlice from "./Warehouse/warehouse.slice";
import batchSlice from "./Batch/batch.slice";
import InspectionAgencies from "./InspectionAgencies/inspection_agencies.slice";
import expenditureTypeSlice from "./ExpenditureType/expenditure.slice";
import expensesSlice from "./Expenses/expenses.slice";
import accountTypesSlice from "./AccountType/accountType.slice";
import accountSlice from "./Account/accounts.slice";
import accountgroupSlice from "./AccountGroup/accountgroup.slice";
import vendorItemSlice from "./VendorItems/vendorItems.slice";
import clientLocationSlice from "./ClientLocations/cliantlocation.slice";

const mastersReducer = combineReducers({
	departments: departmentSlice,
	states: stateSlice,
	country: countrySlice,
	city: citySlice,
	location: locationSlice,
	baseunit: baseunitSlice,
	moc: mocSlice,
	make: makeSlice,
	vendors: vendorsSlice,
	itemgroup: itemgroupSlice,
	accountgroup: accountgroupSlice,
	accounts: accountSlice,
	customers: customersSlice,
	items: itemsSlice,
	tax: taxSlice,
	category: categorySlice,
	document: documentSlice,
	company: companySlice,
	bidnature: bidnatureSlice,
	stages: stageSlice,
	warehouse: warehouseSlice,
	batch: batchSlice,
	inspectionAgencies: InspectionAgencies,
	expenditureType: expenditureTypeSlice,
	expenses: expensesSlice,
	accountTypes: accountTypesSlice,
	vendorItems: vendorItemSlice,
	clientLocation: clientLocationSlice,
});

export default mastersReducer;
