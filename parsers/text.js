import {Paragraph} from "../paragraph";
import {Document} from "../document";

export function ParseText(text) {
    let paragraphs = text.split(/\r?\n/).map(p => {
        let par = new Paragraph();
        par.addText(p);
        return par;
    });
    return new Document(paragraphs);
}
