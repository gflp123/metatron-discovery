import {AbstractComponent} from "../../../common/component/abstract.component";
import {Component, ElementRef, Injector, ViewChild} from "@angular/core";
import {ConstantService} from "../../../shared/datasource-metadata/service/constant.service";
import {EventBroadcaster} from "../../../common/event/event.broadcaster";
import {SchemaConfigureFilterComponent} from "./schema-configure-filter.component";
import {SchemaConfigureFieldComponent} from "./schema-configure-field.component";
import {Filter} from "../../../shared/datasource-metadata/domain/filter";
import {SchemaConfigureTimestampComponent} from "./schema-configure-timestamp.component";
import {DataStorageConstant} from "../../constant/data-storage-constant";
import {Alert} from "../../../common/util/alert.util";

@Component({
  selector: 'schema-configure-main',
  templateUrl: 'schema-configure-main.component.html'
})
export class SchemaConfigureMainComponent extends AbstractComponent {

  // filter
  public searchKeyword: string;
  public selectedRoleFilter: Filter.Role = this.constant.getRoleTypeFilterFirst();
  public selectedTypeFilter: Filter.Logical = this.constant.getTypeFiltersFirst();

  @ViewChild(SchemaConfigureFilterComponent)
  private readonly _filterComponent: SchemaConfigureFilterComponent;

  @ViewChild(SchemaConfigureFieldComponent)
  private readonly _fieldComponent: SchemaConfigureFieldComponent;

  @ViewChild(SchemaConfigureTimestampComponent)
  private readonly _timestampComponent: SchemaConfigureTimestampComponent;


  constructor(private constant: ConstantService,
              private broadCaster: EventBroadcaster,
              protected element: ElementRef,
              protected injector: Injector) {
    super(element, injector);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  public init(fieldList, dataList): void {
    // init field list
    this._fieldComponent.initField(fieldList);
    this._fieldComponent.initDataList(dataList);
    // ready
    this._fieldComponent.ready();
  }

  public getConfigureData() {
    return {
      searchKeyword: this._filterComponent.searchKeyword,
      selectedRoleFilter: this._filterComponent.selectedRoleFilter,
      selectedTypeFilter: this._filterComponent.selectedTypeFilter,
      fieldList: this._fieldComponent.fieldList,
      selectedField: this._fieldComponent.selectedField,
      dataList: this._fieldComponent.dataList,
      selectedTimestampField: this._fieldComponent.selectedTimestampField,
      selectedTimestampType: this._fieldComponent.selectedTimestampType,
      // timestampFieldData
      timestampFieldData: this._fieldComponent.selectedTimestampType === DataStorageConstant.Datasource.TimestampType.FIELD ? this._fieldComponent.dataList.map(data => data[this._fieldComponent.selectedTimestampField.name]) : []
    }
  }

  public initLoadedConfigureData(data): void {
    // set filter
    this._filterComponent.initFilters(data.searchKeyword, data.selectedRoleFilter, data.selectedTypeFilter);
    this._fieldComponent.initFilters(data.searchKeyword, data.selectedRoleFilter, data.selectedTypeFilter);
    // set list
    this._fieldComponent.initField(data.fieldList, data.selectedField);
    this._fieldComponent.initDataList(data.dataList);
    // set timestamp
    this._fieldComponent.initSelectedTimestamp(data.selectedTimestampField, data.selectedTimestampType);
    // ready
    this._fieldComponent.ready();
  }

  public isExistFieldError(): boolean {
    // if select timestamp type is FIELD, not selected timestamp field
    if (this._fieldComponent.selectedTimestampType === DataStorageConstant.Datasource.TimestampType.FIELD && this._fieldComponent.isEmptySelectedTimestampField()) {
      Alert.warning(this.translateService.instant('msg.storage.ui.configure.schema.require.timestamp.column'));
      return false;
    }
    // enable field list
    const enableFieldList = this._fieldComponent.fieldList.filter(field => !this._fieldComponent.isRemovedField(field));
    // if all field unloaded
    if (enableFieldList.length === 0) {
      Alert.warning(this.translateService.instant('msg.storage.ui.configure.schema.require.column'));
      return false;
    }
    // if exist error in field
    if (this._fieldComponent.isExistErrorFieldInFieldList(enableFieldList)) {
      Alert.warning(this.translateService.instant('msg.storage.ui.schema.error.desc'));
      return false;
    }
    return true;
  }
}
