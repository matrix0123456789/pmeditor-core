import {Paragraph} from "../paragraph";
import {Document} from "../document";

export function ParseXmlString(xmlString) {
    let parser = new DOMParser();
    let xml = parser.parseFromString(xmlString, "application/xml");
    return ParseXml(xml);
}

export function ParseXml(xml) {
    if (xml instanceof XMLDocument)
        return ParseXml(xml.firstElementChild)
    else {
        let name = xml.nodeName;
        let type;
        switch (name) {
            case 'pmeditor':
                type = Document;
                break;
            case 'paragraph':
                type = Paragraph;
                break;
        }
        return type.fromXml(xml);
    }
}