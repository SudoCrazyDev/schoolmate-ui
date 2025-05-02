import { Page, Text, View, Document, PDFViewer, StyleSheet   } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    parentContainer:{
        width: "50%",
        padding: "30px"
    },
    heading:{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        marginBottom: "30px"
    },
    headingText:{
        fontSize:"10px"
    },
    info:{
        display: "flex",
        flexDirection: "row",
        paddingTop: "3px"
    },
    infoVal:{
        textDecoration: "underline"
    }
});

export default function DTRForm(){
    return(
        <PDFViewer className='w-100' style={{height: "100vh"}}>
            <Document>
                <Page size="A4" style={{padding: "20px", display: "flex", flexDirection: "row", fontSize: "10px"}}>
                    <View style={styles.parentContainer}>
                        <View style={styles.heading}>
                            <Text style={styles.headingText}>Republic of the Philippines</Text>
                            <Text style={styles.headingText}>DEPARTMENT OF EDUCATION</Text>
                            <Text style={styles.headingText}>Region XII</Text>
                            <Text style={styles.headingText}>SCHOOL</Text>
                            <Text style={styles.headingText}>SCHOOL ADDRESS</Text>
                        </View>
                        <View style={styles.info}>
                            <Text>Name:</Text>
                            <Text style={{...styles.infoVal, marginLeft: "60px"}}>PHILIP LOUIS CALUB</Text>
                        </View>
                        <View style={styles.info}>
                            <Text>For the month of:</Text>
                            <Text style={{...styles.infoVal, marginLeft: "13px"}}>APRIL</Text>
                        </View>
                        <View style={styles.info}>
                            <Text>Official Hours:</Text>
                            <Text style={{...styles.infoVal, marginLeft: "26px"}}> 09:00AM - 05:00AM</Text>
                        </View>
                    </View>
                    <View style={styles.parentContainer}>
                        <View style={styles.heading}>
                            <Text style={styles.headingText}>Republic of the Philippines</Text>
                            <Text style={styles.headingText}>DEPARTMENT OF EDUCATION</Text>
                            <Text style={styles.headingText}>Region XII</Text>
                            <Text style={styles.headingText}>SCHOOL</Text>
                            <Text style={styles.headingText}>SCHOOL ADDRESS</Text>
                        </View>
                    </View>
                    
                </Page>
            </Document>
        </PDFViewer>
    );
};