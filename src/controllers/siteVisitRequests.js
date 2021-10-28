var db = require("../models");

exports.fetch_all_requests= async(req,res,next)=>{
    try{
        let fetchAllRequests= await db.SiteVisitRequest.findAll();
        res.status(200).json({
            status: 'success',
            payload: fetchAllRequests,
            message: 'Requests fetched successfully'
        })

    }
    catch(error){
        console.log("Error ==> " + error)
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while fetching requests'
        });
    }
}

exports.create_request=async(req,res,next)=>{
    try{
        let {user_id,name,company_name,visit_date,visit_time,status}=req.body
         let newRequest =await db.SiteVisitRequest.create({
            user_id,user_id,
            name:name,
            company_name: company_name,
            date:visit_date,
            time:visit_time,
            status:status
         });
         res.status(200).json({
             'status':'success',
             'payload':newRequest,
             'message':'Request created successfully'
         })
    }
    catch(error){
        console.log("Error=========>"+error)
        res.status(500).json({
            'status':'failed',
            'payload':{},
            'message':'Request failed to create'
        })

    }
}

exports.update_request= async(req,res,next) =>{
    try{
        let { id } = req.params;
        let {status}=req.body;
        let fetchRequest = await db.SiteVisitRequest.findOne({
            where: {
                id: id
            }
        });
        if(fetchRequest===null){
            res.json({
                "status":"failed",
                "message":"fetchRequest failed"
            })
        }
        let updateRequest= await db.SiteVisitRequest.update({
            user_id:fetchRequest.user_id,
            name:fetchRequest.name,
            company_name:fetchRequest.company_name,
            date:fetchRequest.date,
            time:fetchRequest.time,
            status:status?status:fetchRequeststatus
        },{
            where: {
                id: id
            },
            returning: true
        }
        )
        let fetchUpdatedRequests = updateRequest[1].length > 0 ? (updateRequest[1])[0] : null;
        res.status(200).json({
            'status':'success',
            'payload':fetchUpdatedRequests,
            'message':'Request updated successfully'
        })

    }catch(error){
        console.log("Error=====>"+error)
        res.status(500).json({
            'status':'failed',
            'payload':{},
            'message':'Request failed to update'
        })
    }
}