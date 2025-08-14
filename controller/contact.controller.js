import contactModel from "../model/contact.model.js";


export async function createContact(req, res) {
  try {
    const { phone, phone_2, email, landline, addresses ,mapUrl} = req.body;
    console.log(req.body);
    

    //  Required fields check
    if (!phone || !phone_2 || !email || !addresses  || !Array.isArray(addresses) || addresses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide phone, email and at least one address"
      });
    }

    //  addresses array के हर object में required fields चेक करें
    for (let addr of addresses) {
      if (!addr.type || !addr.address || !addr.city || !addr.pincode || !addr.mapUrl) {
        return res.status(400).json({
          success: false,
          message: "Each address must have type, address, city, and pincode"
        });
      }
    }

    //  Save to DB
    const contact = await contactModel.create({
      phone,
      phone_2,
      email,
      landline,
      addresses, // अब array में होगा [{type, address, city, pincode}]
      mapUrl
    });

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: contact
    });

  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
}




export async function getCurrentContact(req, res) {
  try {
    const contact = await contactModel
      .findOne()                 // सिर्फ एक record लाने के लिए
      .sort({ createdAt: -1 });  // latest वाला record (descending)

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}
