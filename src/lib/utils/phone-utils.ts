import {
  parsePhoneNumberFromString,
  getCountries,
  getCountryCallingCode,
  CountryCode,
} from "libphonenumber-js";

// Obtenemos la lista de todos los países con sus códigos
export const countryList = getCountries().map((country) => ({
  name: new Intl.DisplayNames(["es"], { type: "region" }).of(country),
  iso: country as CountryCode,
  code: getCountryCallingCode(country),
}));

export const validatePhoneNumber = (phone: string, countryIso: CountryCode) => {
  const phoneNumber = parsePhoneNumberFromString(phone, countryIso);
  return phoneNumber ? phoneNumber.isValid() : false;
};

export const formatToE164 = (phone: string, countryIso: CountryCode) => {
  const phoneNumber = parsePhoneNumberFromString(phone, countryIso);
  return phoneNumber ? phoneNumber.format("E.164") : phone;
};
