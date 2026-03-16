const farmerProfileService = require('./farmerProfileService')

exports.createOrUpdateFarmerProfile = async (req, res, next) => {
    try {
        let farmerId = req.user.userId
        
        // If admin, allow passing farmerId in body to create profile for others
        if (req.user.userType === 'admin' && req.body.farmerId) {
            farmerId = req.body.farmerId
        }

        const result = await farmerProfileService.createOrUpdateProfile(farmerId, req.body, req.file)
        res.status(result.isNew ? 201 : 200).json({
            success: true,
            message: result.message,
            data: { profile: result.profile }
        })
    } catch (error) {
        next(error)
    }
}

exports.getFarmerProfile = async (req, res, next) => {
    try {
        const farmerId = req.params.id || req.user.userId
        const result = await farmerProfileService.getProfile(farmerId, req.user.userId, req.user.userType)
        
        res.status(200).json({
            success: true,
            message: result.message,
            data: { 
                profile: result.exists ? result.profile : null,
                exists: result.exists
            }
        })
    } catch (error) {
        next(error)
    }
}

exports.getAllFarmerProfiles = async (req, res, next) => {
    try {
        const profiles = await farmerProfileService.getAllProfiles()
        res.status(200).json({
            success: true,
            message: 'Farmer profiles retrieved successfully',
            data: { profiles }
        })
    } catch (error) {
        next(error)
    }
}