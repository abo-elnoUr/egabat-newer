import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  activation() {
    Swal.fire({
      title: "عملية ناجحة",
      text: "تم التفعيل بنجاح",
      icon: "success",
      timer: 1500,
      position: "center"
    })
  }

  deActivation() {
    Swal.fire({
      title: "عملية ناجحة",
      text: "تم إلغاء التفعيل بنجاح",
      icon: "success",
      timer: 1500,
      position: "center"
    })
  }

  updateSuccess() {
    Swal.fire({
      title: "عملية ناجحة",
      text: "تم تعديل البيانات بنجاح",
      icon: "success",
      timer: 1500,
      position: "center"
    })
  }

  createSuccess() {
    Swal.fire({
      title: "عملية ناجحة",
      text: "تم حفظ البيانات بنجاح",
      icon: "success",
      timer: 1500,
      position: "center"
    })
  }


  deleteSuccess() {
    Swal.fire({
      title: "عملية ناجحة",
      text: "تم حذف البيانات بنجاح",
      icon: "success",
      timer: 1500,
      position: "center"
    })
  }

  warningDeleting() {
    return Swal.fire({
      title: "انتبه",
      icon: "warning",
      text: "بعد الحذف لا يمكن استرجاع البيانات , هل تريد الحذف ؟",
      confirmButtonText: "حذف",
      confirmButtonColor: "#dc3545",
      cancelButtonText: "إالغاء",
      showCancelButton: true,
    })
  }

}
