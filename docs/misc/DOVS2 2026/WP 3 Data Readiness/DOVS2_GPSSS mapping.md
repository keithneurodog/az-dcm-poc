## Connection between GPS and DOVS 2 project {#slide-1}

Jamie MacPherson

## Background:  Data Office Value Streams {#slide-2}

2

What are Data Office Value Stream?

R&D Data Office runs all work initiatives and work by  Data Office Value Streams  (of which there are currently five). This is true even in cases it delivers work to outside projects and  programmes . We map all work in this way because:

All Data Office staff and resources and mapped and reported by value stream

Value streams have defined governance and Data Office leadership sponsorship

Data Office goals and all roadmap items are associated to a value stream.

DOVS2 - Transforming Data Sharing & Access & DOVS3 - Delivering Targeted Data Solutions  

These are the two  Data Office Value Stream  under which all R&D Data Office work associated to the Global Patient Safety Strategic Solution (GPSSS) project will be mapped.

## Background: GPSSS Project {#slide-3}

3

GPSSS -- Global Patient Safety Strategic Solution.

This project is to build a solution to support patient safety to monitor and interpret patient safety data from AZ-sponsored clinical trials as part of ongoing review processes and for next generation submissions.

GPSSS is split into three workstreams:

- Workstream 1 -  Ways of Working , focusing on patient safety processes associated to the solution.
- Workstream 2 --  Data Pipeline,  focusing on providing the requisite patient safety data from historic and ongoing studies, enabling downstream visualization.  This is the workstream that has notable alignment with GPSSS
- Workstream 3 --  Data  Visualisation , focusing on the production and deployment of a service that provides  PowerBI  visual analytics to support patient safety processes.

## What work elements of the GPSSS project will be mapped into DOVS? {#slide-4}

Pipeline - metadata work (define standards, devise capture process and tech, remediate historical studies) to ensure capture of study metadata

Pipeline - PDR to PDP integration.

IS mapped to DOVS2

Visual analytics -  template creation, connection to data, with support & handover. 

IS mapped to DOVS3

Pipeline - Build and integrations associated to the Raw Data Store

Ways of working (workstream 1 in GPSSS)

IS NOT mapped to a DOVS

4

At a conceptual, high level, the  following  bullets cover the entirety of the GPSSS project. 

## Map of GPSSS, DOVS2 intersect {#slide-5}

5

DOVS2 unique work package

GPSSS unique work package

Shared work package

Role-based open access

AI & Tech for data sharing processes

Patient 360

DOVS2

Study metadata standards & capture

PDP data poo 2014+ (+integration to PDR)

Multi-modal data

...

...

GPSSS

Data Pipeline

Data Vis

Ways of working

Historic metadata remediation

Transforming data sharing and access, with current focus on patient data for BioPharma & Oncology data scientists, engineers, biometrics and other quantitative scientists

Supporting GPS with analytics solution and service to support critical-path pipeline delivery processes (SST, NGS).

Multiple data formats, incl.  ADaM

Requirements are truly shared (not by chance), with potentially differing priorities on what studies and data within studies are of greatest importance.

## Management, governance & decision-making {#slide-6}

6

Patient 360

DOVS2

Study metadata standards & capture

PDP data poo 2014+ (+integration to PDR)

GPSSS

Data Pipeline

Historic metadata remediation

Multiple data formats, incl.  ADaM

DOVS2 Gov Board  -- steer, risk mitigation and support from Data Office / DS&AI

Lead : Jamie MacPherson

GPSSS Steering committee

Prj   Mngrs   - Camilla Eliasson (overarching), Irene Fourie (study Patient)

Maria  Benjegard  / Magda  Wlodarczak   PDP data & Metadata completion

Bijay Jassal --  Data Standards

Junyu Luan --  Raw Data Store

Architecture --  Cristoffer  Stedt

Prj   Mngrs   -- Cayetana Vazquez (Data Office), Irne Fourie (Study Patient)

Maria  Benjegard  / Magda  Wlodarczak   - PDP data & Study Metadata completion

Bijay Jassal --  Data Standards

Architecture --  Cristoffer  Stedt

Data Pipeline gov board (proposed)

Alignment Mechanism required:

Risk, issues, resourcing, priorities & plan

Programme  manager  -- Louse Fincham

Programme  manager  -- Martina 

## DRAFT options for discussion: {#slide-7}

7

Jamie  overall accountable lead across both workstreams, with decision making over shared/opposing priorities (with support from gov boards)

Camilla  responsible for project management of R&D IT deliverables in scope of Patient Safety (many of which are which are also be in P360)

Cayetana  responsible for project management of R&D Data Office sponsored deliverables in scope of P360 DOVS2 workstream (which around metadata  delluverables  are also part of GPSSS)

Maria, Magda and Irene  responsible   for Data Office & R&D IT Study Patient deliverables, including PDP data and metadata completeness

Camilla,  Cayatana  and Irene  responsible for alignment around risk and issue management (and escalation to appropriate route), project plans, (shared) prioritization of deliverables, and shared views on resourcing.

## Data Pipeline -- what it will deliver {#slide-8}

For what processes?

NGS submissions , which requires study data for submission, plus historic background for ISS

Safety Surveillance , TMG (implementation effectiveness), TPP, which requires both ongoing study and historic data

Additional,  the data pipeline could be leveraged for other activities, such as support for trial design & planning, and beyond GPS (e.g., other data science work in therapy areas)

China & Japan submissions? ;

Data scope

In scope:

By delivery model, Source & Type of data : AZ sponsored studies (AZ-Rave Delta or CROs-Landing Zone); labs

By time-point : Historic data from 2014 (consistent format) onwards by default, and older studies by request, plus current studies for submission and surveillance

Metadata:  Deliver the ability to capture milestone and protocol event metadata that supports downstream use of datasets

Out of scope:  Non-AZ sponsored and owned;  China & Japan submissions? ;  Argus?

Key assumptions 

RCDF will deliver completed study data into PDR Application, as planned, in addition to a  planned change  via this project to export interim cuts or closed study arms to PDR

The Data Pipe will be  GxP  validated, the existing components in the pipeline are validated today and should remain so. This allows for  decision making  on data if needed

A clear set of analysis priorities \~3 months ahead for additional data (e.g., additional historic study data)

Additional existing data -- Argus -- is already accessible.

## Proposed Data Flow {#slide-9}

9

Sources

Collection/Aggregation

Visualisation/Output

Rave DELTA\*

PDLZ\*  (Raw Data)

PDLZ\*   (Outsourced Study)

PDR\*

RAW Data Store

Patient Data Product

PowerBI

Non eCRF data

eCRF

New Component

\* RCDF component

KEY

AZCT / Other for study dataset-milestone mapping

RYZE

(Study Instance Metadata)

A set of visual analytic or tabular templates that support NGS and SST requirements

High-frequency data from ongoing studies to satisfy SST process

Programmed outputs to support NGS submissions

Metadata to enable understanding of dataset context

Historic studies and static output data for submission-analysis

AZ sponsored internally & externally run studies and non eCRF labs

New data integration

Enhanced component

## Slide 10

10
