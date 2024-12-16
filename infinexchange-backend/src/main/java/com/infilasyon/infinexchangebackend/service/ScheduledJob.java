package com.infilasyon.infinexchangebackend.service;

import com.infilasyon.infinexchangebackend.entity.Currency;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.math.BigDecimal;
import java.net.URL;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RequiredArgsConstructor
@Component("updateCurrencies")
public class ScheduledJob {

    private final CurrencyService currencyService;

    private static final String URL = "https://www.tcmb.gov.tr/kurlar/today.xml";

    @Scheduled(cron = "0 31 15 * * *") // Her gün 15:31'te çalışacak şekilde ayarlanmıştır
    public void updateCurrencies() {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(new URL(URL).openStream());

            NodeList currencyNodes = doc.getElementsByTagName("Currency");

            for (int i = 0; i < currencyNodes.getLength(); i++) {
                Element currencyElement = (Element) currencyNodes.item(i);
                Map<String, String> currencyData = new HashMap<>();
                currencyData.put("CurrencyCode", currencyElement.getAttribute("CurrencyCode"));
                currencyData.put("Unit", currencyElement.getElementsByTagName("Unit").item(0).getTextContent());
                currencyData.put("CurrencyName", currencyElement.getElementsByTagName("Isim").item(0).getTextContent());
                currencyData.put("ForexBuying", currencyElement.getElementsByTagName("ForexBuying").item(0).getTextContent());
                currencyData.put("ForexSelling", currencyElement.getElementsByTagName("ForexSelling").item(0).getTextContent());

                if (Objects.equals(currencyData.get("CurrencyCode"), "XDR")) {
                    break;
                }
                updateOrSaveCurrency(currencyData);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void updateOrSaveCurrency(Map<String, String> currencyData) {
        String code = currencyData.get("CurrencyCode");
        String currencyName = currencyData.get("CurrencyName");
        BigDecimal buying = new BigDecimal(currencyData.get("ForexBuying"));
        BigDecimal selling = new BigDecimal(currencyData.get("ForexSelling"));
        String unit =  currencyData.get("Unit");

        Currency currency = currencyService.getCurrencyByCode(code).orElse(new Currency());
        currency.setCode(code);
        currency.setCurrencyName(currencyName);
        currency.setBuying(buying);
        currency.setSelling(selling);
        currency.setUnit(unit);
        currency.setUpdatedDate(new Date());

        currencyService.updateCurrency(code,buying,selling);
    }
}
