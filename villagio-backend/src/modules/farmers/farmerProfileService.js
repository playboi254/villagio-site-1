const path = require('path')
const fs = require('fs')
const { FarmerProfile } = require('../../models/farmerProfileDB')

exports.createOrUpdateProfile = async (farmerId, profileData, file) => {
    const { farmName, businessName, farmLocation, farmSize, categoriesDealtWith, aboutFarm } = profileData

    let farmImage = null
    if (file) {
        const ext = path.extname(file.originalname)
        const newFilename = Date.now() + ext
        const newPath = path.join("uploads", newFilename)
        
        fs.renameSync(file.path, newPath)
        farmImage = newPath.replace(/\\/g, "/")
    }

    const profile = await FarmerProfile.findOne({ farmer: farmerId })

    if (profile) {
        profile.farmName = farmName
        profile.businessName = businessName
        profile.farmLocation = farmLocation
        profile.farmSize = farmSize
        profile.categoriesDealtWith = categoriesDealtWith
        profile.aboutFarm = aboutFarm
        
        if (farmImage) {
            profile.farmImage = farmImage
        }

        profile.updatedAt = Date.now()
        await profile.save()
        return { message: 'Updated successfully', profile, isNew: false }
    } else {
        const newProfile = new FarmerProfile({
            farmer: farmerId,
            farmName,
            businessName,
            farmLocation,
            farmSize,
            categoriesDealtWith,
            aboutFarm,
            farmImage
        })
        await newProfile.save()
        return { message: 'Created successfully', profile: newProfile, isNew: true }
    }
}

exports.getProfile = async (targetFarmerId, requestingUserId, requestingUserType) => {
    const profile = await FarmerProfile.findOne({ farmer: targetFarmerId }).populate('farmer', 'name email')

    if (!profile) {
        return { exists: false, message: 'No profile created yet' }
    }

    if (requestingUserId !== targetFarmerId && requestingUserType !== 'admin') {
        const err = new Error('Access denied')
        err.status = 403
        throw err
    }

    return { exists: true, profile }
}

exports.getAllProfiles = async () => {
    return await FarmerProfile.find().populate('farmer', 'name email')
}
