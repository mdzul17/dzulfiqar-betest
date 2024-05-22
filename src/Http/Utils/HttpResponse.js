class HttpResponse{
    success(res, data) {
        return res.status(200).json({
            message: "Request successful",
            code: 200,
            data
        })
    }

    error(res, message) {
        return res.status(500).json({
            message,
            code: 500
        })
    }

    notFound(res, message){
        return res.status(404).json({
            message,
            code: 404
        })
    }

    badRequest(res,message){
        return res.status(400).json({
            message,
            code: 400
        })
    }

    validationError(res, err){
        return res.status(400).json({
            message: "Validation error, please check your inputs",
            code: 400,
            err
        })
    }
}

module.exports = HttpResponse