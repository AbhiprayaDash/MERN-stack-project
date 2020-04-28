import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import {connect} from 'react-redux';
import {deleteEducation} from '../../actions/profile';


const Education = ({education,deleteEducation}) => {
    const edu = education.map(edu=>(
       <tr key={edu._id}>
           <td>{edu.school}</td>
           <td className="hide-sm">{edu.degree}</td>
           <td>
            <Moment format='YYYY/MM/DD'>{edu.from}</Moment> -{' '}
                {edu.to ===null ? ('Now'):
                (<Moment format='YYYY/MM/DD'>{edu.to}</Moment>)
            }
           </td>
           <button className ='btn btn-danger'onClick={() =>deleteEducation(edu._id)}>Delete</button>
       </tr>
    ));
    return (
        <Fragment>
            <h2 classNam="my-2">Education Credentials</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>School</th>
                        <th className="hide-sm">Degree</th>
                        <th className="hide-sm">Years</th>
                    </tr>
                </thead>
                <br></br>
                <tbody>{edu}</tbody>
            </table>
        </Fragment>
    )
};

Education.propTypes = {
    education:PropTypes.array.isRequired,
    deleteEducation:PropTypes.func.isRequired,

}

export default connect(null,{deleteEducation})(Education);
