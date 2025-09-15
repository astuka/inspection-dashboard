This is the issue log. It keeps track of all ongoing issues in the code. Each issue is separated by a "---" series of dashes. Please focus on tackling one issue at a time for enhanced effiency. Some errors are automated, while others are user specific.


---
For the custom TOOLTIP, the word wrapping creates too many lines (i.e. it stacks vertically). Please make this two lines maximum. 

---
For the SYSTEM DETAIL, remove the 'Units Inspected (Current Period)' and 'Current Defects (7 days)' columns, and just keep 'System Information'. Though flatten this out horizontally so it fits with the size of the card.

---

Across both SYSTEM DETAIL and FLEET REPORTING, make it so that the colors of the pie slices represent the severity of the defect. For example, defects labeled as "low severity" should be in shades of green, medium in shades of yellow, and high in shades of red. 

--- 

In FLEET REPORTING, there is small clarifiers under the numbers of the topmost cards. For example:

Daily Throughput
5,481
units inspected

Where 'units inspected' is the clarifier which helps the user understand what the number means. I think this is a smart idea and I'd like to expand it to all of these topmost cards in FLEET DASHBOARD and SYSTEM DETAIL as well. 