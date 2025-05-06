import { Document, PDFViewer } from '@react-pdf/renderer';
import DTRFormPageComponent from './DTRFormPageComponent';


export default function DTRForm({attendances, teacher, override}){
    return(
        <PDFViewer className='w-100' style={{height: "80vh"}}>
            <Document>
                <DTRFormPageComponent
                    teacher={teacher}
                    attendances={attendances}
                    override={override}
                />
            </Document>
        </PDFViewer>
    );
};