import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useEffect, useState } from 'react';
import { Page, Text, View, Document, PDFViewer, Image  } from '@react-pdf/renderer';
import pb from '../../../global/pb';
import PrintIcon from '@mui/icons-material/Print';
import { IconButton, Tooltip } from '@mui/material';
import { GetActiveInstitution } from '../../../global/Helpers';

export default function ViewGrades({student}){
    const [open ,setOpen] = useState(false);
    const [subjectGrades, setSubjectGrades] = useState([]);
    const {title} = GetActiveInstitution();
    
    const handleModalState = () => {
        setOpen(!open);
    };
    
    const handleFetchStudentGrades = async () => {
        try {
            const subject_grades = await pb.collection("student_grades")
            .getFullList({
                filter: `student="${student.id}"`,
                expand: 'subject'
            });
            setSubjectGrades(subject_grades);
        } catch (error) {
            console.log(error);
        }
    };
    
    const handleFilterStudentGrade = (subject, grading) => {
        // if(student.grades.length === 0) return '';
        // const filteredResult = student.grades.filter(grade => grade.subject_id === subject && grade.grading === grading);
        // if(filteredResult.length === 0) return '';
        // return Number(filteredResult[0].value);
        return 0;
    };
    
    useEffect(() => {
        if(open){
            handleFetchStudentGrades();
        }
    }, [open]);
    return(
        <>
        <Tooltip title="Print Grades">
            <IconButton size="small" onClick={() => handleModalState()} color="primary">
                <PrintIcon fontSize="small"/>
            </IconButton>
        </Tooltip>
        {/* <Button size="small" variant='contained' color='primary' onClick={() => handleModalState()}>View Grades</Button> */}
        <Dialog
        open={open}
        fullScreen
        scroll='paper'
        >
            <form>
                <DialogContent dividers>
                    <div className="d-flex flex-row flex-wrap">
                        <div className="col-3 border-top border-bottom border-start border-end d-flex flex-column justify-content-center align-items-center">
                            <p className='m-0 fw-bolder fs-5'>LEARNING AREAS</p>
                        </div>
                        <div className="col-4 border-top border-bottom d-flex flex-column">
                            <p className='m-0 fw-bolder fs-5 border-bottom border-end d-flex flex-column justify-content-center align-items-center'>Quarter</p>
                            <div className="d-flex flex-row">
                                <div className="col-3 border-end">
                                    <p className='m-0 fw-bolder fs-5 d-flex flex-column justify-content-center align-items-center'>1</p>
                                </div>
                                <div className="col-3 border-end">
                                    <p className='m-0 fw-bolder fs-5 d-flex flex-column justify-content-center align-items-center'>2</p>
                                </div>
                                <div className="col-3 border-end">
                                    <p className='m-0 fw-bolder fs-5 d-flex flex-column justify-content-center align-items-center'>3</p>
                                </div>
                                <div className="col-3 border-end">
                                    <p className='m-0 fw-bolder fs-5 d-flex flex-column justify-content-center align-items-center'>4</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-3 border-top border-bottom border-end d-flex flex-column justify-content-center align-items-center">
                            <p className='m-0 fw-bolder fs-5'>Final Grade</p>
                        </div>
                        <div className="col-2 border-top border-bottom border-end d-flex flex-column justify-content-center align-items-center">
                            <p className='m-0 fw-bolder fs-5'>Remarks</p>
                        </div>
                        {subjectGrades.map((subject, index) => (
                            <div key={index} className="d-flex flex-row col-12">
                                <div className="col-3 border-bottom border-start border-end d-flex flex-column justify-content-center align-items-center">
                                    <p className='m-0 fw-bolder fs-5'>{subject?.expand?.subject?.title}</p>
                                </div>
                                <div className="col-4 border-bottom d-flex flex-column h-100">
                                    <div className="d-flex flex-row h-100">
                                        <div className="col-3 border-end">
                                            <p className='m-0 fw-bolder fs-5 d-flex flex-column justify-content-center align-items-center h-100'>{subject.quarter_one}</p>
                                        </div>
                                        <div className="col-3 border-end">
                                            <p className='m-0 fw-bolder fs-5 d-flex flex-column justify-content-center align-items-center'>{subject.quarter_two}</p>
                                        </div>
                                        <div className="col-3 border-end">
                                            <p className='m-0 fw-bolder fs-5 d-flex flex-column justify-content-center align-items-center'>{subject.quarter_three}</p>
                                        </div>
                                        <div className="col-3 border-end">
                                            <p className='m-0 fw-bolder fs-5 d-flex flex-column justify-content-center align-items-center'>{subject.quarter_four}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-3 border-bottom border-end d-flex flex-column justify-content-center align-items-center">
                                    <p className='m-0 fw-bolder fs-5'>0</p>
                                </div>
                                <div className="col-2 border-bottom border-end d-flex flex-column justify-content-center align-items-center">
                                    <p className='m-0 fw-bolder fs-5'>PASSED</p>
                                </div>
                            </div>
                        ))}
                        <div className="d-flex flex-row col-12">
                            <div className="col-3 border-bottom border-start d-flex flex-column justify-content-center align-items-center">
                                <p className='m-0 fw-bolder fs-5'>GENERAL AVERAGE</p>
                            </div>
                            <div className="col-4 border-bottom d-flex flex-column h-100">
                                <div className="d-flex flex-row h-100">
                                    <div className="col-3">
                                        <p className='m-0 fw-bolder fs-5 d-flex flex-column justify-content-center align-items-center h-100'></p>
                                    </div>
                                    <div className="col-3">
                                        <p className='m-0 fw-bolder fs-5 d-flex flex-column justify-content-center align-items-center'></p>
                                    </div>
                                    <div className="col-3">
                                        <p className='m-0 fw-bolder fs-5 d-flex flex-column justify-content-center align-items-center'></p>
                                    </div>
                                    <div className="col-3 border-end">
                                        <p className='m-0 fw-bolder fs-5 d-flex flex-column justify-content-center align-items-center'></p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3 border-bottom border-end d-flex flex-column justify-content-center align-items-center">
                                <p className='m-0 fw-bolder fs-5'>0</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-5">
                        <PDFViewer className='w-100' style={{height: '600px'}}>
                            <Document>
                                <Page size="A5" orientation="landscape" style={{display: 'flex', flexDirection: 'row'}}>
                                    <View style={{width: '50%', padding: '20px'}}>
                                        <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', marginBottom: '10px'}}>REPORT OF ATTENDANCE</Text>
                                            <View style={{width: '100%', display: 'flex', flexDirection: 'column', border: '1px solid black'}}>
                                                <View style={{width: '100%', display: 'flex', flexDirection: 'row', borderBottom: '1px solid black'}}>
                                                    <View style={{width: '15%', borderRight: '1px solid black', padding: '2px'}}>
                                                        <Text style={{fontSize: '5px', textAlign: 'center'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Jun</Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Jul</Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Aug</Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Sep</Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Oct</Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Nov</Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Dec</Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Jan</Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Feb</Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Mar</Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Apr</Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Total</Text>
                                                    </View>
                                                </View>
                                                <View style={{width: '100%', display: 'flex', flexDirection: 'row', borderBottom: '1px solid black'}}>
                                                    <View style={{width: '15%', borderRight: '1px solid black', padding: '2px'}}>
                                                        <Text style={{fontSize: '5px', textAlign: 'center'}}>No. of School Days</Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                </View>
                                                <View style={{width: '100%', display: 'flex', flexDirection: 'row', borderBottom: '1px solid black'}}>
                                                    <View style={{width: '15%', borderRight: '1px solid black', padding: '2px'}}>
                                                        <Text style={{fontSize: '5px', textAlign: 'center'}}>No. of days present</Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                </View>
                                                <View style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                                                    <View style={{width: '15%', borderRight: '1px solid black', padding: '2px'}}>
                                                        <Text style={{fontSize: '5px', textAlign: 'center'}}>No. of days absent</Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                    <View style={{width: '7%', textAlign: 'center'}}>
                                                        <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}></Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <Text style={{fontSize: '10px', fontFamily: 'Helvetica-Bold', marginTop: '50px'}}>PARENT / GUARDIAN'S SIGNATURE</Text>
                                            <Text style={{fontSize: '10px', fontFamily: 'Helvetica-Bold', marginTop: '20px', alignSelf: 'flex-start'}}>1st Quarter ___________________________________</Text>
                                            <Text style={{fontSize: '10px', fontFamily: 'Helvetica-Bold', marginTop: '20px', alignSelf: 'flex-start'}}>2nd Quarter ___________________________________</Text>
                                            <Text style={{fontSize: '10px', fontFamily: 'Helvetica-Bold', marginTop: '20px', alignSelf: 'flex-start'}}>3rd Quarter ___________________________________</Text>
                                            <Text style={{fontSize: '10px', fontFamily: 'Helvetica-Bold', marginTop: '20px', alignSelf: 'flex-start'}}>4th Quarter ___________________________________</Text>
                                        </View>
                                    </View>
                                    
                                    <View style={{width: '50%', padding: '20px'}}>
                                        
                                        <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                            <View style={{display: 'flex', flexDirection: 'row', marginBottom: '3px'}}>
                                                <Image source={'/gscnssat_logo.png'} style={{height: 45, width: 49}}></Image>
                                                <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10px', marginHorizontal: '10px', gap: '1px'}}>
                                                    <Text style={{fontSize: '8px', fontFamily:'Helvetica-Bold'}}>Republic of the Philippines</Text>
                                                    <Text style={{fontSize: '8px', fontFamily:'Helvetica-Bold'}}>Department of Education</Text>
                                                    <Text style={{fontSize: '8px', fontFamily:'Helvetica-Bold'}}>Region XII</Text>
                                                    <Text style={{fontSize: '8px', fontFamily:'Helvetica-Bold'}}>Division of General Santos City</Text>
                                                </View>
                                                <Image source={'/gscnssat_logo.png'} style={{height: 45, width: 49}}></Image>
                                            </View>
                                            <Text style={{fontSize: '6px', fontFamily:'Helvetica-Bold'}}>{title}</Text>
                                            <Text style={{fontSize: '6px', fontFamily:'Helvetica-Bold'}}>Lagao, General Santos City</Text>
                                            
                                            <View style={{marginTop: '14px', display: 'flex', flexDirection: 'row', alignSelf: 'flex-start'}}>
                                                {/* <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Name: {student.student.details.last_name}, {student.student.details.first_name}</Text> */}
                                            </View>
                                            
                                            <View style={{marginTop: '3px', display: 'flex', flexDirection: 'row', alignSelf: 'flex-start', gap: '5px'}}>
                                                <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Age: </Text>
                                                {/* <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Sex: {String(student.student.details.gender).toUpperCase()}</Text> */}
                                            </View>
                                            
                                            <View style={{marginTop: '3px', display: 'flex', flexDirection: 'row', alignSelf: 'flex-start', gap: '5px'}}>
                                                {/* <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Grade/Section: {student.section.grade_level.grade_level} - {student.section.section_name}</Text> */}
                                                <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Curriculum: </Text>
                                            </View>
                                            
                                            <View style={{marginTop: '3px', display: 'flex', flexDirection: 'row', alignSelf: 'flex-start', gap: '5px'}}>
                                                <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>School Year: 2024 - 2025</Text>
                                                <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>LRN: </Text>
                                            </View>
                                            
                                            <View style={{marginTop: '5px', display: 'flex', flexDirection: 'column'}}>
                                                <Text style={{fontSize: '8px', fontFamily: 'Helvetica', marginBottom: '5px'}}>Dear Parent:</Text>
                                                <Text style={{fontSize: '8px', fontFamily: 'Helvetica', marginLeft: '10px'}}>This report card shows the ability and profress your</Text>
                                                <Text style={{fontSize: '8px', fontFamily: 'Helvetica'}}>child has made in different learning areas as well as his/her core values.</Text>
                                                <Text style={{fontSize: '8px', fontFamily: 'Helvetica', marginLeft: '10px'}}>The school welcomes you should you desire to know more about your child's progress.</Text>
                                            </View>
                                            
                                            <View style={{marginTop: '1px', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                                                <View style={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                    <Text>___________</Text>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', marginTop: '2px'}}>Teacher</Text>
                                                </View>
                                            </View>
                                            
                                            <View style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginTop: '-10px'}}>
                                                <View style={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                    <Text>___________</Text>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', marginTop: '2px'}}>Principal</Text>
                                                </View>
                                            </View>
                                            
                                            <View style={{marginTop: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '10px'}}>Certificate of Transfer</Text>
                                                <View style={{display: 'flex', flexDirection: 'row', marginTop: '5px', maringBottom: '5px', alignSelf: 'flex-start'}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica'}}>Admitted to Grade:______________</Text>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica'}}>Section:______________</Text>
                                                </View>
                                                <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'flex-start'}}>Eligibility for Admission to Grade:_______________________</Text>
                                                <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'flex-start', marginVertical: '3px'}}>Approved:</Text>
                                                <View style={{display: 'flex', flexDirection: 'row'}}>
                                                    <View style={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                        <Text>___________</Text>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', marginTop: '2px'}}>Principal</Text>
                                                    </View>
                                                    <View style={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                        <Text>___________</Text>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', marginTop: '2px'}}>Teacher</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            
                                            <View style={{marginTop: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '10px', marginTop: '-5px', marginBottom: '3px'}}>Cancellation of Eligibility to Transfer</Text>
                                                <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'flex-start'}}>Admitted In:_______________________</Text>
                                                <View style={{display: 'flex', flexDirection: 'row'}}>
                                                    <View style={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                        <Text>___________</Text>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica'}}>Date</Text>
                                                    </View>
                                                    <View style={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                        <Text>___________</Text>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica'}}>Principal</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            
                                        </View>
                                        
                                    </View>
                                </Page>
                                <Page size="A5" orientation="landscape" style={{display: 'flex', flexDirection: 'row', fontFamily: 'Helvetica'}}>
                                    
                                    <View style={{height: '100%', width: '50%', padding: '20px', display: 'flex', flexDirection: 'column'}}>
                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', marginBottom: '10px'}}>REPORT ON LEARNING PROGRESS AND ACHIEVEMENT</Text>
                                        {/* TABLE HEADER */}
                                        <View style={{display: 'flex', flexDirection: 'row', border: '1px solid black'}}>
                                            <View style={{width: '30%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}>Learning Areas</Text>
                                            </View>
                                            <View style={{width: '40%', display: 'flex', flexDirection: 'column', borderRight: '1px solid black'}}>
                                                <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}>Quarter</Text>
                                                <View style={{display: 'flex', flexDirection: 'row', borderTop: '1px solid black'}}>
                                                    <View style={{width: '25%', borderRight: '1px sold black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', alignSelf: 'center'}}>1</Text>
                                                    </View>
                                                    <View style={{width: '25%', borderRight: '1px sold black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', alignSelf: 'center'}}>2</Text>
                                                    </View>
                                                    <View style={{width: '25%', borderRight: '1px sold black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', alignSelf: 'center'}}>3</Text>
                                                    </View>
                                                    <View style={{width: '25%'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', alignSelf: 'center'}}>4</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}>Final Grade</Text>
                                            </View>
                                            <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}>Remarks</Text>
                                            </View>
                                        </View>
                                        {/* BEGIN TABLE CONTENT HERE */}
                                        {subjectGrades.map((subject, i) => (
                                            <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                <View style={{width: '30%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}>{subject?.expand?.subject?.title}</Text>
                                                </View>
                                                <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                        <Text>{subject.quarter_one}</Text>
                                                    </View>
                                                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                        <Text>{subject.quarter_two}</Text>
                                                    </View>
                                                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                        <Text>{subject.quarter_three}</Text>
                                                    </View>
                                                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                        <Text>{subject.quarter_four}</Text>
                                                    </View>
                                                </View>
                                                <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                </View>
                                                <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                </View>
                                            </View>
                                        ))}
                                            <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                <View style={{width: '70%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', alignSelf: 'center'}}>GENERAL AVERAGE</Text>
                                                </View>
                                                <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                </View>
                                                <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                </View>
                                            </View>
                                            
                                            <View style={{marginTop: 'auto', display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                                                <View style={{width: '40%'}}>
                                                    <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Descriptors</Text>
                                                </View>
                                                <View style={{width: '30%'}}>
                                                    <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Grading Scale</Text>
                                                </View>
                                                <View style={{width: '30%'}}>
                                                    <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Remarks</Text>
                                                </View>
                                                <View style={{width: '100%', display: 'flex', flexDirection: 'row', marginTop: '5px'}}>
                                                    <View style={{width: '40%'}}>
                                                        <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Outstanding</Text>
                                                    </View>
                                                    <View style={{width: '30%'}}>
                                                        <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>90-100</Text>
                                                    </View>
                                                    <View style={{width: '30%'}}>
                                                        <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Passed</Text>
                                                    </View>
                                                </View>
                                                <View style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                                                    <View style={{width: '40%'}}>
                                                        <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Very Satisfactory</Text>
                                                    </View>
                                                    <View style={{width: '30%'}}>
                                                        <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>85-89</Text>
                                                    </View>
                                                    <View style={{width: '30%'}}>
                                                        <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Passed</Text>
                                                    </View>
                                                </View>
                                                <View style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                                                    <View style={{width: '40%'}}>
                                                        <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Satisfactory</Text>
                                                    </View>
                                                    <View style={{width: '30%'}}>
                                                        <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>80-84</Text>
                                                    </View>
                                                    <View style={{width: '30%'}}>
                                                        <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Passed</Text>
                                                    </View>
                                                </View>
                                                <View style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                                                    <View style={{width: '40%'}}>
                                                        <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Fairly Satisfactory</Text>
                                                    </View>
                                                    <View style={{width: '30%'}}>
                                                        <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>75-84</Text>
                                                    </View>
                                                    <View style={{width: '30%'}}>
                                                        <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Passed</Text>
                                                    </View>
                                                </View>
                                                <View style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                                                    <View style={{width: '40%'}}>
                                                        <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Did Not Meet Expectations</Text>
                                                    </View>
                                                    <View style={{width: '30%'}}>
                                                        <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Below 75</Text>
                                                    </View>
                                                    <View style={{width: '30%'}}>
                                                        <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Failed</Text>
                                                    </View>
                                                </View>
                                            </View>
                                    </View>
                                    
                                    <View style={{height: '100%', width: '50%', padding: '20px', display: 'flex', flexDirection: 'column'}}>
                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', marginBottom: '10px'}}>REPORT ON LEARNER'S OBSERVED VALUES</Text>
                                        <View style={{display: 'flex', flexDirection: 'row', border: '1px solid black'}}>
                                            <View style={{width: '18%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                <Text style={{fontSize: '8px', fontFamily: 'Helvetica'}}>Core Values</Text>
                                            </View>
                                            <View style={{width: '42%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}>Behavior Statements</Text>
                                            </View>
                                            <View style={{width: '40%', display: 'flex', flexDirection: 'column'}}>
                                                <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}>Quarter</Text>
                                                <View style={{display: 'flex', flexDirection: 'row', borderTop: '1px solid black'}}>
                                                    <View style={{width: '25%', borderRight: '1px sold black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', alignSelf: 'center'}}>1</Text>
                                                    </View>
                                                    <View style={{width: '25%', borderRight: '1px sold black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', alignSelf: 'center'}}>2</Text>
                                                    </View>
                                                    <View style={{width: '25%', borderRight: '1px sold black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', alignSelf: 'center'}}>3</Text>
                                                    </View>
                                                    <View style={{width: '25%'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', alignSelf: 'center'}}>4</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        
                                        <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                            <View style={{width: '18%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                <Text style={{fontSize: '7px', fontFamily: 'Helvetica', alignSelf: 'center', whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>Maka-Diyos</Text>
                                            </View>
                                            <View style={{width: '42%', display: 'flex', flexDirection:'column', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                <View style={{borderBottom: '1px solid black'}}>
                                                    <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                        Expresses one's spritals beliefs while respecting the spiritual beliefs of others
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                        Show adherence to ethical principles by upholding truth
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={{width: '40%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text></Text>
                                                </View>
                                                <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text></Text>
                                                </View>
                                                <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text></Text>
                                                </View>
                                                <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text></Text>
                                                </View>
                                            </View>
                                        </View>
                                        
                                        <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                            <View style={{width: '18%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                <Text style={{fontSize: '7px', fontFamily: 'Helvetica', alignSelf: 'center', whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>Maka Tao</Text>
                                            </View>
                                            <View style={{width: '42%', display: 'flex', flexDirection:'column', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                <View style={{borderBottom: '1px solid black'}}>
                                                    <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                        Is sensitive to individual, social and cultural differences
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                        Demonstrates contributions towards solidarity
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={{width: '40%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text ></Text>
                                                </View>
                                                <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text></Text>
                                                </View>
                                                <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text></Text>
                                                </View>
                                                <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text></Text>
                                                </View>
                                            </View>
                                        </View>
                                        
                                        <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                            <View style={{width: '18%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                <Text style={{fontSize: '7px', fontFamily: 'Helvetica', alignSelf: 'center'}}>Maka Kalikasan</Text>
                                            </View>
                                            <View style={{width: '42%', display: 'flex', flexDirection:'column', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                <View>
                                                    <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '3px'}}>
                                                        Cares for the environment and utilizes resources wisely, judiciously, and economically.
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={{width: '40%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text ></Text>
                                                </View>
                                                <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text></Text>
                                                </View>
                                                <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text></Text>
                                                </View>
                                                <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text></Text>
                                                </View>
                                            </View>
                                        </View>
                                        
                                        <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                            <View style={{width: '18%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                <Text style={{fontSize: '7px', fontFamily: 'Helvetica', alignSelf: 'center', whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>Maka Bansa</Text>
                                            </View>
                                            <View style={{width: '42%', display: 'flex', flexDirection:'column', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                <View style={{borderBottom: '1px solid black'}}>
                                                    <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                        Demonstrates pride in being a Filipini; excercises the rights and responsibilities of a Filipini citizen.
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                        Demonstrates appropriate behaviour in carrying out activities in the school, community, and country.
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={{width: '40%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text ></Text>
                                                </View>
                                                <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text></Text>
                                                </View>
                                                <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text></Text>
                                                </View>
                                                <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text></Text>
                                                </View>
                                            </View>
                                        </View>
                                        
                                        <View style={{marginTop: 'auto', display: 'flex', flexDirection: 'column'}}>
                                            <View style={{display: 'flex', flexDirection: 'row', paddingBottom: '5px'}}>
                                                <Text style={{width: '20%', fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Marking</Text>
                                                <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Non-numerical Rating</Text>
                                            </View>
                                            <View style={{display: 'flex', flexDirection: 'row'}}>
                                                <Text style={{width: '20%', fontFamily: 'Helvetica', fontSize: '8px'}}>AO</Text>
                                                <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Always Observed</Text>
                                            </View>
                                            <View style={{display: 'flex', flexDirection: 'row'}}>
                                                <Text style={{width: '20%', fontFamily: 'Helvetica', fontSize: '8px'}}>SO</Text>
                                                <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Somtimes Observed</Text>
                                            </View>
                                            <View style={{display: 'flex', flexDirection: 'row'}}>
                                                <Text style={{width: '20%', fontFamily: 'Helvetica', fontSize: '8px'}}>RO</Text>
                                                <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Rarely Observed</Text>
                                            </View>
                                            <View style={{display: 'flex', flexDirection: 'row'}}>
                                                <Text style={{width: '20%', fontFamily: 'Helvetica', fontSize: '8px'}}>NO</Text>
                                                <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Not Observed</Text>
                                            </View>
                                            <View style={{display: 'flex', flexDirection: 'row'}}>
                                                <Text style={{width: '20%', fontFamily: 'Helvetica', fontSize: '8px'}}> </Text>
                                                <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}> </Text>
                                            </View>
                                        </View>
                                        
                                    </View>
                                    
                                </Page>
                            </Document>
                        </PDFViewer>
                    </div>
                </DialogContent>
                <DialogActions className='justify-content-start'>
                    {/* <Button variant='contained' color='primary' onClick={() => handleModalState()}>Print</Button> */}
                    <Button variant='contained' color='error' onClick={() => handleModalState()}>Close</Button>
                </DialogActions>
            </form>
        </Dialog>
        </>
    );
};