import { Response } from "express";
import { Assembly } from "../models/assembly";
import { User } from "../models/user";
import { RequestWithNtnuiNo } from "../utils/request";
import { Votation, Option } from "../models/vote";
import { OptionType } from "../types/vote"; 



export async function createVotation( 
    req: RequestWithNtnuiNo,
    res: Response
  ) { 
    if (!req.ntnuiNo) {
        return res.status(401).json({ message: "Unauthorized" });
      }

    const group = req.body.group;
    const title = req.body.title; 
    let voteDescription = req.body.voteText;  
    const optionTitle = req.body.optionTitle; 
    const user = await User.findById(req.ntnuiNo);

    if (voteDescription === undefined) { 
      voteDescription = ""
    }
  
    if (user) {
      if (
        user.groups.some(
          (membership) => membership.organizer && membership.groupSlug == group
        )
      ) {

        let tempOptionTitles: OptionType[] = []
        if (optionTitle != undefined) {
          optionTitle.forEach(function(title: string) {
            tempOptionTitles.push(new Option(
                {
                  title: title, 
                  voteCount: 0
                }
              ))
          });
       }
        
        const newVotation = new Votation(
          {
            title: title, 
            isFinished: false,
            options: tempOptionTitles, 
            voteText: voteDescription, 
          }
        )
        
        const assembly = await Assembly.findById(group);
        if (assembly != null && title != undefined) {
          let tempVotes = assembly.votes;
          if (tempVotes.length === 0) {
            tempVotes = [newVotation];
          } else {
            tempVotes.push(newVotation); 
          }
          await Assembly.findByIdAndUpdate(
            group,
            {
            $set: {
              votes: tempVotes,
            },
          })
          return res.status(200).json({ message: "Votation successfully created" });
        } else {
          return res.status(400).json(title == undefined ? {message: "Votation is missing title"} : { message: "Assembly not found" });

        }
      }
    }

  return res
    .status(401)
    .json({ message: "You are not authorized to proceed with this request" });
}


export async function setVotationStatus(
    req: RequestWithNtnuiNo,
    res: Response
  ) {
    if (!req.ntnuiNo) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const group = req.body.group;
    const voteId = req.body.voteId; 
    const user = await User.findById(req.ntnuiNo);
    
    
    if (user) {
      if (
        user.groups.some(
          (membership) => membership.organizer && membership.groupSlug == group
          )
          ) {
            
            const assembly = await Assembly.findById(group); 
            console.log("tester123123123123123")
            //console.log("Tester: ", test); 
            const votation = assembly?.votes;
            //const vote = votation?.find(({_id}) => _id === voteId )
            if (votation != undefined) {

              console.log("votation: ", votation[1].title);
            }
             

      }

    return res
      .status(401)
      .json({ message: "heiii, You are not authorized to proceed with this request" });
  }
}



export async function deleteVotation(
    req: RequestWithNtnuiNo,
    res: Response
  ) {
    if (!req.ntnuiNo) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    
    return res
      .status(401)
      .json({ message: "Testing delete, You are not authorized to proceed with this request" });
}


export async function editVotation(
    req: RequestWithNtnuiNo,
    res: Response
  ) {
    if (!req.ntnuiNo) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res
      .status(401)
      .json({ message: "Testing edit, You are not authorized to proceed with this request" });
}





export async function getAssemblyByName(
    req: RequestWithNtnuiNo,
    res: Response
  ) {
    if (!req.ntnuiNo) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const groupSlug = req.body.groupSlug;
    const user = await User.findById(req.ntnuiNo);
  
    if (user) {
      if (
        user.groups.some(
          (membership) =>
            membership.organizer && membership.groupSlug == groupSlug
        )
      ) {
        const assembly = await Assembly.findById(groupSlug);
        if (assembly == null) {
          return res
            .status(400)
            .json({ message: "No assembly with the given ID found" });
        }
  
        return res.status(200).json(assembly);
      }
    }
    return res
      .status(401)
      .json({ message: "You are not authorized to proceed with this request" });
  }