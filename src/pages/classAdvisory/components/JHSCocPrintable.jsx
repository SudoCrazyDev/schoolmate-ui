import { Page, PDFViewer, View, Image, Font, StyleSheet, Document, Text  } from "@react-pdf/renderer";

Font.register({ family: 'Old English Text MT', src: '/assets/fonts/oldenglishtextmt.ttf' });
Font.register({ family: 'Bookman Old Style', fonts: [
    {src: '/assets/fonts/BookMan/bookmanoldstyle.ttf'},
    {src: '/assets/fonts/BookMan/bookmanoldstyle_bold.ttf', fontWeight: "bold"},
    {src: '/assets/fonts/BookMan/bookmanoldstyle_italic.ttf', fontStyle:"italic"},
    {src: '/assets/fonts/BookMan/bookmanoldstyle_bolditalic.ttf', fontStyle:"italic" ,fontWeight: "bold"},
]});

const styles = StyleSheet.create({
    page:{
        fontFamily: 'Bookman Old Style',
        fontSize: "11px"
    },
    smallFont:{
        fontSize: "9px",
        fontStyle: "italic"
    },
    oldEnglish: {
      fontFamily: 'Old English Text MT',
      fontSize: "14px"
    },
    oldEnglishSmall:{
        fontFamily: 'Old English Text MT',
        fontSize: "10px"
    },
    logo:{
        width: "144px"
    },
    schoolTitle:{
        fontSize: "14px",
        fontWeight: "bold"
    },
    studentName:{
        marginTop: "5px",
        fontSize: "18px",
        textTransform: "uppercase",
        fontWeight: "bold",
    },
    studentlrn:{
        fontSize: "9px",
    },
    katunayan:{
        marginTop: "10px",
        fontSize: "18px",
        fontWeight: "bold"
    },
    certificate:{
        fontWeight: "bold",
        fontStyle: "italic"
    },
    footerNames:{
        fontWeight: "bold",
        fontSize: "12px",
    }
})
export default function JHSCocPrintable({advisory, student}){
    return(
        <PDFViewer className='w-100' style={{height: '90vh'}}>
            <Document>
                <Page size="A4" orientation="landscape" style={styles.page}>
                    <View style={{display: "flex", flexDirection: "column", height: "100%"}}>
                        {/* ======== HEADER ======== */}
                        <View style={{marginLeft:"5%", marginTop:"2%", marginRight:"5%", display: "flex", flexDirection: "row", justifyContent: "center"}}>
                            <Image source={`/deped-logo.png`} style={styles.logo}></Image>
                            <View style={{flexGrow:"1",display: "flex", flexDirection:"column", alignItems: "center", gap: "3px"}}>
                                <Text style={styles.oldEnglish}>Republic of the Philippines</Text>
                                <Text style={styles.oldEnglishSmall}>Republic of the Philippines</Text>
                                <Text style={styles.oldEnglish}>Kagawaran ng Edukasyon</Text>
                                <Text style={styles.oldEnglishSmall}>Department of Education</Text>
                                <Text style={{marginTop: "10px", fontWeight: "bold"}}>REHIYON XII</Text>
                                <Text style={styles.smallFont}>Region XII</Text>
                                <Text style={{marginTop: "10px", fontWeight: "bold"}}>SANGAY NG LUNGSOD NG HENERAL SANTOS</Text>
                                <Text style={styles.smallFont}>Division of General Santos City</Text>
                            </View>
                            <Image source={`/deped-division-gsc.png`} style={styles.logo}></Image>
                        </View>
                        {/* ======== HEADER ======== */}
                        
                        {/* ======== CONTENT ======== */}
                        <View style={{paddingTop:"20px", display: "flex", flexDirection: "row", justifyContent: "center"}}>
                            <View style={{flexGrow:"1",display: "flex", flexDirection:"column", alignItems: "center", gap: "3px"}}>
                                <Text style={styles.schoolTitle}>{advisory?.institution?.title}</Text>
                                <Text style={{marginTop: "15px",}}>Pinatutunayan nito na si</Text>
                                <Text style={styles.smallFont}>This certifies that</Text>
                                <Text style={styles.studentName}>{student?.first_name} {String(student?.middle_name).charAt(0)}. {student?.last_name}</Text>
                                <Text style={styles.studentlrn}>Learner Reference Number {'(LRN)'}: {student?.lrn}</Text>
                                <Text style={{marginTop: "10px"}}>ay kasiya-siyang nakatupad sa mga kinakailangan sa Kurikulum ng Junior High School na itinakda para sa</Text>
                                <Text style={styles.smallFont}>has satisfactorily completed the requirements of the Junior High School Curriculum prescribed for</Text>
                                <Text style={{marginTop: "10px"}}>Mataas na Paaralan ng Kagawaran ng Edukasyon, kaya pinagkalooban siya nitong</Text>
                                <Text style={styles.smallFont}>Secondary Schools of the Department of Education and is therefore awarded this</Text>
                                <Text style={styles.katunayan}>KATUNAYAN</Text>
                                <Text style={styles.certificate}>CERTIFICATE</Text>
                                <Text style={{marginTop: "10px"}}>Nilagdaan sa Lungsod ng Heneral Santos, Pilipinas nitong ika-15 ng Abril 2025.</Text>
                                <Text style={styles.smallFont}>Signed in the City of General Santos, Philippines on the 15th day of April 2025.</Text>
                            </View>
                        </View>
                        {/* ======== CONTENT ======== */}
                        
                        {/* ======== FOOTER ======== */}
                        <View style={{marginLeft:"5%", marginTop:"auto", marginRight:"5%", marginBottom: "2%", paddingTop:"20px", display: "flex", flexDirection: "row"}}>
                            <View style={{marginLeft: "8%", display: "flex", flexDirection:"column", alignItems: "center", gap: "3px"}}>
                                <Text style={styles.footerNames}>{advisory?.institution?.principal?.[0]?.first_name} {String(advisory?.institution?.principal?.[0]?.middle_name).charAt(0)}. {advisory?.institution?.principal?.[0]?.last_name}</Text>
                                <Text>Punongguro</Text>
                            </View>
                            <View style={{marginLeft:"auto", display: "flex", flexDirection:"column", alignItems: "center", gap: "3px"}}>
                                <Text style={styles.footerNames}>ISAGANI S. DELA CRUZ, CESO V</Text>
                                <Text>Pansangay na Tagapamanihala ng mga Paaralan</Text>
                            </View>
                        </View>
                        {/* ======== FOOTER ======== */}
                        
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};