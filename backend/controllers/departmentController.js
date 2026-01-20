import Department from "../models/Department.js";

const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({company: req.user.company._id});
        return res.status(200).json({success: true, departments});
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || "get departments server error"
        });
    }
};

const addDepartment = async (req, res) => {
    try {
        const {dep_name, description} = req.body;
        const newDep = new Department({dep_name, description, company: req.user.company._id});
        await newDep.save();
        return res.status(200).json({success: true, department: newDep});
    } catch (error) {
        return res.status(500).json({success: false, error: "add department server error"});
    }
};

const getDepartment = async (req, res) => {
    try {
        const {id} = req.params;
        const department = await Department.findById(id);

        if (department && department.company && department.company.toString() !== req.user.company._id.toString()) {
            return res.status(403).json({success: false, error: "Access Denied: Department belongs to another company"});
        }

        return res.status(200).json({success: true, department});
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || "get departments server error"
        });
    }
}

const updateDepartment = async (req, res) => {
    try {
        const {id} = req.params;
        const {dep_name, description} = req.body;

        const department = await Department.findById(id);
        if (department && department.company && department.company.toString() !== req.user.company._id.toString()) {
            return res.status(403).json({success: false, error: "Access Denied: Department belongs to another company"});
        }

        const updatedDepartment = await Department.findByIdAndUpdate(id, {dep_name, description});
        return res.status(200).json({success: true, department: updatedDepartment});
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || 'update department server error'
        });
    }
};

const deleteDepartment = async (req, res) => {
    try {
        const {id} = req.params;
        const deletedep = await Department.findById(id);

        if (deletedep && deletedep.company && deletedep.company.toString() !== req.user.company._id.toString()) {
            return res.status(403).json({success: false, error: "Access Denied: Department belongs to another company"});
        }

        await deletedep.deleteOne()
        return res.status(200).json({success: true, department: deletedep});
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || 'delete department server error'
        });
    }
}

export {
    addDepartment,
    getDepartments,
    getDepartment,
    updateDepartment,
    deleteDepartment
};
