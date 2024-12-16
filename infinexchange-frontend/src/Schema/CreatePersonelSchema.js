import * as Yup from 'yup';

const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const CreatePersonelSchema = Yup.object({
    firstName: Yup.string().required('Lütfen adınızı giriniz!'),
    lastName: Yup.string().required('Lütfen soyadınızı giriniz!'),
    username: Yup.string().required('Lütfen kullanıcı adınızı giriniz!'),
    password: Yup.string()
        .required("Lütfen şifrenizi giriniz!")
        .matches(passwordRegexp, "Şifre en az 8 karakter uzunluğunda, bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir."),
    email: Yup.string()
        .required('Lütfen mailinizi giriniz!')
        .email("Lütfen geçerli bir email adresi giriniz!"),
    role: Yup.string().required("Lütfen yetki türünü seçiniz!"),
});
