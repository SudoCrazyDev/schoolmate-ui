import { Page, Text, View, StyleSheet   } from '@react-pdf/renderer';
import { convertTo12Hour, staffNameBuilder, staffNameBuilderFirstNameFirst } from '../../../global/Helpers';

const styles = StyleSheet.create({
    parentContainer:{
        width: "50%",
        padding: "10px",
        border: "1px solid black"
    },
    heading:{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        marginBottom: "10px"
    },
    headingText:{
        fontSize:"10px",
        textAlign: "center"
    },
    info:{
        display: "flex",
        flexDirection: "row",
        paddingTop: "3px"
    },
    infoTitle:{
        width: "30%"
    },
    infoVal:{
        width:"70%",
        borderBottom: "1px solid black"
    },
    infoHeadingContainer:{
        width: "30%",
        borderRight: "1px solid black",
        padding: "2px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    infoHeading:{
        fontSize: "10px",
        fontFamily: "Helvetica-Bold"
    },
    infoStatusHeading:{
        width: "15%",
        borderRight: "1px solid black",
        padding: "2px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
});

const DTRFormPageComponent = ({teacher, attendances}) => {
    
    const handleFilterByDay = (day, type) => {
        if (attendances && attendances.length > 0) {
            return attendances.filter((attendance) => {
                const authDate = new Date(attendance.auth_date);
                const attendanceDay = authDate.getDate();
                return attendanceDay === day && String(attendance.status).toLowerCase() === type;
              })?.[0]
        }
        return null;
    };
    
    const checkIfPrincipal = () => {
        let is_principal = teacher?.roles.filter(role => role.slug === 'principal') || false;
        let is_assistant_principal = teacher?.roles.filter(role => role.slug === 'assistant-principal') || false;
        if(is_principal.length > 0 || is_assistant_principal.length > 0){
            return true;
        }
        return false;
    };
    
    return(
        <Page size="A4" style={{padding: "10px", display: "flex", flexDirection: "row", fontSize: "10px", gap: "5px"}}>
            <View style={styles.parentContainer}>
                <View style={styles.heading}>
                    <Text style={styles.headingText}>Republic of the Philippines</Text>
                    <Text style={styles.headingText}>DEPARTMENT OF EDUCATION</Text>
                    <Text style={styles.headingText}>Region {teacher?.institutions?.[0]?.region}</Text>
                    <Text style={styles.headingText}>{teacher?.institutions?.[0]?.title}</Text>
                    <Text style={styles.headingText}>{teacher?.institutions?.[0]?.address}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.infoTitle}>Name:</Text>
                    <Text style={styles.infoVal}>{staffNameBuilder(teacher)}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.infoTitle}>For the month of:</Text>
                    <Text style={styles.infoVal}>APRIL</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.infoTitle}>Official Hours:</Text>
                    <Text style={styles.infoVal}></Text>
                </View>
                <View style={{display: "flex", flexDirection: "row", border: "1px solid black", marginTop: "8px"}}>
                    <View style={{width: "10%", borderRight: "1px solid black", padding: "5px"}}>
                    </View>
                    <View style={styles.infoHeadingContainer}>
                        <Text style={styles.infoHeading}>AM</Text>
                    </View>
                    <View style={styles.infoHeadingContainer}>
                        <Text style={styles.infoHeading}>PM</Text>
                    </View>
                    <View style={{...styles.infoHeadingContainer, border: "0"}}>
                        <Text style={styles.infoHeading}>UNDERTIME</Text>
                    </View>
                </View>
                <View style={{display: "flex", flexDirection: "row", border: "1px solid black", borderTop: "0"}}>
                    <View style={{width: "10%", borderRight: "1px solid black", padding: "5px"}}>
                    </View>
                    <View style={styles.infoStatusHeading}>
                        <Text style={styles.infoHeading}>In</Text>
                    </View>
                    <View style={styles.infoStatusHeading}>
                        <Text style={styles.infoHeading}>Out</Text>
                    </View>
                    <View style={styles.infoStatusHeading}>
                        <Text style={styles.infoHeading}>In</Text>
                    </View>
                    <View style={styles.infoStatusHeading}>
                        <Text style={styles.infoHeading}>Out</Text>
                    </View>
                    <View style={styles.infoStatusHeading}>
                        <Text style={styles.infoHeading}>Hour</Text>
                    </View>
                    <View style={{...styles.infoStatusHeading, border: "0"}}>
                        <Text style={styles.infoHeading}>Minute</Text>
                    </View>
                </View>

                {/* ============================================ */}
                {/* ===== START ATTENDANCES ===== */}
                {Array(31).fill().map((_, i) => (
                    <View key={crypto.randomUUID()} style={{display: "flex", flexDirection: "row", border: "1px solid black", borderTop: "0"}}>
                        <View style={{width: "10%", borderRight: "1px solid black", padding: "2px"}}>
                            <Text style={{...styles.infoHeading}}>{i + 1}</Text>
                        </View>
                        <View style={styles.infoStatusHeading}>
                            <Text style={styles.infoHeading}>
                                {convertTo12Hour(handleFilterByDay(i + 1, "check-in")?.auth_time, false, true)}
                            </Text>
                        </View>
                        <View style={styles.infoStatusHeading}>
                            <Text style={styles.infoHeading}>
                                {convertTo12Hour(handleFilterByDay(i + 1, "break-out")?.auth_time, false, true)}
                            </Text>
                        </View>
                        <View style={styles.infoStatusHeading}>
                            <Text style={styles.infoHeading}>
                                {convertTo12Hour(handleFilterByDay(i + 1, "break-in")?.auth_time, false, true)}
                            </Text>
                        </View>
                        <View style={styles.infoStatusHeading}>
                            <Text style={styles.infoHeading}>
                                {convertTo12Hour(handleFilterByDay(i + 1, "check-out")?.auth_time, false, true)}
                            </Text>
                        </View>
                        <View style={styles.infoStatusHeading}>
                            <Text style={styles.infoHeading}></Text>
                        </View>
                        <View style={{...styles.infoStatusHeading, border: "0"}}>
                            <Text style={styles.infoHeading}></Text>
                        </View>
                    </View>
                ))}
                {/* ===== END ATTENDANCES ===== */}
                {/* ============================================ */}

                <View style={{display: "flex", flexDirection: "column"}}>
                    <Text style={{fontSize: "9px", marginTop: "5px", marginLeft: "15px"}}>I certify in my honor that the above is true and correct report on</Text>
                    <Text style={{fontSize: "9px", marginTop: "2px"}}>the work performed record of which is made daily at the time of</Text>
                    <Text style={{fontSize: "9px", marginTop: "2px"}}>arrival and departure from office.</Text>
                </View>
                
                <View style={{borderBottom: "1px solid black", width: "80%", marginTop: "18px", alignSelf: "center"}}>
                    
                </View>
                <Text style={{fontSize: "9px", marginTop: "2px", fontFamily: "Times-Italic", alignSelf: "center"}}>Signature of Employee</Text>
                {!checkIfPrincipal() && (
                    <Text style={{fontSize: "9px", marginTop: "25px", alignSelf: "center", fontFamily: "Helvetica-Bold"}}>
                        {staffNameBuilderFirstNameFirst(teacher?.institutions?.[0]?.principal?.[0])}
                    </Text>
                )}
                {checkIfPrincipal() && (
                    <Text style={{fontSize: "9px", marginTop: "25px", alignSelf: "center", fontFamily: "Helvetica-Bold"}}>
                        MERVIE Y. SEBLOS, CESE
                    </Text>
                )}
                <View style={{borderBottom: "1px solid black", width: "80%", alignSelf: "center"}}>
                    
                </View>
                {!checkIfPrincipal() && (
                    <Text style={{fontSize: "9px", marginTop: "2px", fontFamily: "Times-Italic", alignSelf: "center"}}>
                        School Head
                    </Text>
                )}
                {checkIfPrincipal() && (
                    <Text style={{fontSize: "9px", marginTop: "2px", fontFamily: "Times-Italic", alignSelf: "center"}}>
                        Assistant Schools Division Superintendent
                    </Text>
                )}
            </View>
            
            <View style={styles.parentContainer}>
                <View style={styles.heading}>
                    <Text style={styles.headingText}>Republic of the Philippines</Text>
                    <Text style={styles.headingText}>DEPARTMENT OF EDUCATION</Text>
                    <Text style={styles.headingText}>Region {teacher?.institutions?.[0]?.region}</Text>
                    <Text style={styles.headingText}>{teacher?.institutions?.[0]?.title}</Text>
                    <Text style={styles.headingText}>{teacher?.institutions?.[0]?.address}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.infoTitle}>Name:</Text>
                    <Text style={styles.infoVal}>{staffNameBuilder(teacher)}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.infoTitle}>For the month of:</Text>
                    <Text style={styles.infoVal}>APRIL</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.infoTitle}>Official Hours:</Text>
                    <Text style={styles.infoVal}></Text>
                </View>
                <View style={{display: "flex", flexDirection: "row", border: "1px solid black", marginTop: "8px"}}>
                    <View style={{width: "10%", borderRight: "1px solid black", padding: "5px"}}>
                    </View>
                    <View style={styles.infoHeadingContainer}>
                        <Text style={styles.infoHeading}>AM</Text>
                    </View>
                    <View style={styles.infoHeadingContainer}>
                        <Text style={styles.infoHeading}>PM</Text>
                    </View>
                    <View style={{...styles.infoHeadingContainer, border: "0"}}>
                        <Text style={styles.infoHeading}>UNDERTIME</Text>
                    </View>
                </View>
                <View style={{display: "flex", flexDirection: "row", border: "1px solid black", borderTop: "0"}}>
                    <View style={{width: "10%", borderRight: "1px solid black", padding: "5px"}}>
                    </View>
                    <View style={styles.infoStatusHeading}>
                        <Text style={styles.infoHeading}>In</Text>
                    </View>
                    <View style={styles.infoStatusHeading}>
                        <Text style={styles.infoHeading}>Out</Text>
                    </View>
                    <View style={styles.infoStatusHeading}>
                        <Text style={styles.infoHeading}>In</Text>
                    </View>
                    <View style={styles.infoStatusHeading}>
                        <Text style={styles.infoHeading}>Out</Text>
                    </View>
                    <View style={styles.infoStatusHeading}>
                        <Text style={styles.infoHeading}>Hour</Text>
                    </View>
                    <View style={{...styles.infoStatusHeading, border: "0"}}>
                        <Text style={styles.infoHeading}>Minute</Text>
                    </View>
                </View>

                {/* ============================================ */}
                {/* ===== START ATTENDANCES ===== */}
                {Array(31).fill().map((_, i) => (
                    <View style={{display: "flex", flexDirection: "row", border: "1px solid black", borderTop: "0"}}>
                        <View style={{width: "10%", borderRight: "1px solid black", padding: "2px"}}>
                            <Text style={{...styles.infoHeading}}>{i + 1}</Text>
                        </View>
                        <View style={styles.infoStatusHeading}>
                            <Text style={styles.infoHeading}>
                                {convertTo12Hour(handleFilterByDay(i + 1, "check-in")?.auth_time, false, true)}
                            </Text>
                        </View>
                        <View style={styles.infoStatusHeading}>
                            <Text style={styles.infoHeading}>
                                {convertTo12Hour(handleFilterByDay(i + 1, "break-out")?.auth_time, false, true)}
                            </Text>
                        </View>
                        <View style={styles.infoStatusHeading}>
                            <Text style={styles.infoHeading}>
                                {convertTo12Hour(handleFilterByDay(i + 1, "break-in")?.auth_time, false, true)}
                            </Text>
                        </View>
                        <View style={styles.infoStatusHeading}>
                            <Text style={styles.infoHeading}>
                                {convertTo12Hour(handleFilterByDay(i + 1, "check-out")?.auth_time, false, true)}
                            </Text>
                        </View>
                        <View style={styles.infoStatusHeading}>
                            <Text style={styles.infoHeading}></Text>
                        </View>
                        <View style={{...styles.infoStatusHeading, border: "0"}}>
                            <Text style={styles.infoHeading}></Text>
                        </View>
                    </View>
                ))}
                {/* ===== END ATTENDANCES ===== */}
                {/* ============================================ */}

                <View style={{display: "flex", flexDirection: "column"}}>
                    <Text style={{fontSize: "9px", marginTop: "5px", marginLeft: "15px"}}>I certify in my honor that the above is true and correct report on</Text>
                    <Text style={{fontSize: "9px", marginTop: "2px"}}>the work performed record of which is made daily at the time of</Text>
                    <Text style={{fontSize: "9px", marginTop: "2px"}}>arrival and departure from office.</Text>
                </View>
                
                <View style={{borderBottom: "1px solid black", width: "80%", marginTop: "18px", alignSelf: "center"}}>
                    
                </View>
                <Text style={{fontSize: "9px", marginTop: "2px", fontFamily: "Times-Italic", alignSelf: "center"}}>Signature of Employee</Text>
                {!checkIfPrincipal() && (
                    <Text style={{fontSize: "9px", marginTop: "25px", alignSelf: "center", fontFamily: "Helvetica-Bold"}}>
                        {staffNameBuilderFirstNameFirst(teacher?.institutions?.[0]?.principal?.[0])}
                    </Text>
                )}
                {checkIfPrincipal() && (
                    <Text style={{fontSize: "9px", marginTop: "25px", alignSelf: "center", fontFamily: "Helvetica-Bold"}}>
                        MERVIE Y. SEBLOS, CESE
                    </Text>
                )}
                <View style={{borderBottom: "1px solid black", width: "80%", alignSelf: "center"}}>
                    
                </View>
                {!checkIfPrincipal() && (
                    <Text style={{fontSize: "9px", marginTop: "2px", fontFamily: "Times-Italic", alignSelf: "center"}}>
                        School Head
                    </Text>
                )}
                {checkIfPrincipal() && (
                    <Text style={{fontSize: "9px", marginTop: "2px", fontFamily: "Times-Italic", alignSelf: "center"}}>
                        Assistant Schools Division Superintendent
                    </Text>
                )}
            </View>
        </Page>
    );
};
export default DTRFormPageComponent;