import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';

const environment = env;;
import { IActivationResponse } from 'src/app/helpers/_interfaces/activation-response';
import { IUnit, IUnitsFilter } from 'src/app/helpers/_interfaces/units';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  constructor(
    private _http: HttpClient
  ) { }

  getUnits(filter: IUnitsFilter) {
    console.log(filter);

    return this._http.post<IUnit[]>(`${environment.API_ROOT}/api/Unit/GetSubjectUnitsAdmin`, filter)
  }

  getUnitById(unitId: string) {
    return this._http.get<IUnit>(`${environment.API_ROOT}/api/Unit/GetUnitById/${unitId}`)
  }

  createUnit(unitData: any) {
    return this._http.post(`${environment.API_ROOT}/api/Unit/AddUnit`, unitData)
  }

  editUnit(unitData: any) {
    return this._http.put(`${environment.API_ROOT}/api/Unit/EditUnit`, unitData)
  }

  deleteUnit(unitId: string) {
    return this._http.delete(`${environment.API_ROOT}/api/Unit/DeleteUnit/${unitId}`)
  }

  activationUnit(unitId: string) {
    return this._http.put<IActivationResponse>(`${environment.API_ROOT}/api/Unit/UnitActivation/${unitId}`, {})
  }

}
