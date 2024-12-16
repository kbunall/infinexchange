import * as Yup from "yup";

export const CreateCustomerSchema = (customerType) => Yup.object({
    tcNo: customerType === 0 ? Yup.string().required('Lütfen TC kimlik numaranızı giriniz!') : Yup.string(),
    firstName: customerType === 0 ? Yup.string().required('Lütfen adınızı giriniz!'): Yup.string(),
    lastName: customerType === 0 ? Yup.string().required('Lütfen soyadınızı giriniz!') : Yup.string(),
    dateOfBirth: customerType === 0 ? Yup.string().required('Lütfen doğum tarihinizi giriniz!') : Yup.string(),
    phoneNumber: Yup.string().required('Lütfen telefon numaranızı giriniz!'),
    address: Yup.string().required('Lütfen adresinizi giriniz!'),
    email: Yup.string().required('Lütfen mailinizi giriniz!').email("lütfen geçerli bir email adresi giriniz!"),
    taxNo: customerType === 0 ? Yup.string() : Yup.string().required("Lütfen vergi numaranızı giriniz!"),
    corporationName: customerType === 0 ? Yup.string() :Yup.string().required("Lütfen kurum adınızı giriniz!"),
})
