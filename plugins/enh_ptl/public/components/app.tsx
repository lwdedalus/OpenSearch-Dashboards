import React, { 
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
  useRef,
  createRef,
} from 'react';

import { FormattedMessage, I18nProvider } from '@osd/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';
import { PLUGIN_ID, PLUGIN_NAME } from '../../common';

import {
  EuiButton,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageHeader,
  EuiTitle,
  EuiPopover,
  EuiDataGrid,
  EuiDataGridColumn,
  EuiDataGridControlColumn,
  EuiScreenReaderOnly,
  EuiModal,
  EuiModalHeader,
  EuiModalBody,
  EuiModalHeaderTitle,
  EuiModalFooter,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiFlyoutFooter,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiContextMenuPanel,
  EuiContextMenuItem,
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiTextArea
} from '@elastic/eui';

let entries: PTLEntry[] = [];
const gridRef = createRef();
const DataContext = createContext(entries);

interface EnhPtlAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

type PTLEntry = {
  ptlEntryId: number;
  patient: {
    identifier: string;
    nhsNumber: string;
    firstName: string;
    lastName: string;
    dob: Date;
    address: string;
  };
  consultantName: string;
  referral: {
    sourceLocal: string;
    toSpecialty: number;
    toTreatmentFunctionOrService: string;
    status: string;
    received: Date;
  };
  rttStatus: boolean;
  rttBreachDate: Date;
  futureApptDate: Date;
  tciApptDate: Date;
  comments: {
    opdTeam: string;
    reasonForEscalation: string;
    instructionalFeedback: string;
    actionedByOPDTeam: string;
  };
};

for (let i = 1; i <= 20; i++) {

  entries.push({
    ptlEntryId: i,
    patient: {
      identifier: (i+10).toString() + (i+10).toString() + (i+10).toString(),
      nhsNumber: (i+10).toString() + (i+10).toString() + (i+10).toString() + (i+10).toString() + (i+10).toString() + (i+10).toString(),
      firstName: 'Test',
      lastName: 'Patient ' + i.toString(),
      dob: new Date(1990 - i, 9, i),
      address: (80 + i).toString() + " High Street, Stevenage, SG1 3DW",
    },
    consultantName: i > 5 ? 'Mr Consultant ' + i.toString() : 'Mrs Consultant ' + i.toString(),
    referral: {
      sourceLocal: 'NHS Trust 1',
      toSpecialty: i,
      toTreatmentFunctionOrService: 'N/A',
      status: 'string',
      received: new Date(2022, 9 - i, i),
    },
    rttStatus: i % 2 === 0,
    rttBreachDate: new Date(new Date().setDate(new Date().getDate() - i)),
    futureApptDate: new Date(),
    tciApptDate: new Date(),
    comments: {
      opdTeam: 'Attempted to contact patient on ' + new Date().toLocaleDateString() + ' but could not reach them.',
      reasonForEscalation: '',
      instructionalFeedback: '',
      actionedByOPDTeam: ''
    }
  });
}

{/*
const cloneUserbyId = (id: number) => {
  const index = entries.findIndex((entry) => entry.id === id);
  if (index >= 0) {
    const user = entries[index];
    entries.splice(index, 0, { ...user, id: entries.length });
  }
};
*/}

{/*
const deleteUsersByIds = (...ids: number[]) => {
  ids.forEach((id) => {
    const index = entries.findIndex((entry) => entry.id === id);
    if (index >= 0) {
      entries.splice(index, 1);
    }
  });
};
*/}

const columns: Array<EuiDataGridColumn> = [
  {
    id: 'ptlEntryId',
    displayAsText: '#',
    defaultSortDirection: 'asc',
    initialWidth: 70,
    isSortable: false,
    cellActions: [
      ({ rowIndex, columnId, Component }) => {
        const data = useContext(DataContext);
        return (
          <Component
            onClick={() => alert(`ptlEntryId: ${data[rowIndex].ptlEntryId}`)}
            iconType="alert"
            aria-label={`ptlEntryId: ${data[rowIndex].ptlEntryId}`}
          >
          </Component>
        );
      },
    ],
  },
  {
    id: 'patient.identifier',
    displayAsText: 'Patient Id',
    initialWidth: 130,
    cellActions: [
      ({ rowIndex, columnId, Component }) => {
        const data = useContext(DataContext);
        return (
          <Component
            onClick={() => alert(data[rowIndex].patient.identifier)}
            iconType="email"
            aria-label={`patient.identifier: ${data[rowIndex].patient.identifier}`}
          >
          </Component>
        );
      },
    ],
  },
  {
    id: 'patient',
    displayAsText: 'Patient Name (DOB)',
  },
  {
    id: 'consultantName',
    displayAsText: 'Consultant',
    actions: {
      showHide: { label: 'Hide' },
      showMoveLeft: true,
      showMoveRight: true,
      additional: [
        {
          label: 'Filter',
          onClick: () => {},
          iconType: 'filter',
          size: 'xs',
          color: 'text',
        },
      ],
    },
    cellActions: [
      ({ rowIndex, columnId, Component, isExpanded }) => {
        const data = useContext(DataContext);
        const onClick = isExpanded
          ? () =>
              alert(`Sent money to ${data[rowIndex].patient.identifier} when expanded`)
          : () =>
              alert(
                `Sent money to ${data[rowIndex].patient.identifier} when not expanded`
              );
        return (
          <Component
            onClick={onClick}
            iconType="faceHappy"
            aria-label={`Send money to ${data[rowIndex].patient.identifier}`}
          >
          </Component>
        );
      },
    ],
  },
  {
    id: 'referredToSpeciality',
    displayAsText: 'Referred To Specialty',
    defaultSortDirection: 'desc',
  },
  {
    id: 'rttStatus',
    displayAsText: 'RTT Status',
  },
  {
    id: 'rttBreachDate',
    displayAsText: '18wk Breach Date',
  },
];

const trailingControlColumns: Array<EuiDataGridControlColumn> = [
  {
    id: 'actions',
    width: 40,
    headerCellRender: () => (
      <EuiScreenReaderOnly>
        <span>Controls</span>
      </EuiScreenReaderOnly>
    ),
    rowCellRender: function RowCellRender({ rowIndex }) {

      const data = useContext(DataContext);

      const [isPopoverVisible, setIsPopoverVisible] = useState(false);
      const closePopover = () => setIsPopoverVisible(false);

      const [isModalVisible, setIsModalVisible] = useState(false);
      const closeModal = () => {
        setIsModalVisible(false);
        gridRef.current.setFocusedCell({ rowIndex });
      };

      const showModal = () => {
        closePopover();
        setIsModalVisible(true);
      };

      let modal;

      if (isModalVisible) {
        modal = (
          <EuiModal onClose={closeModal} style={{ width: 1500 }}>
            <EuiModalHeader>
              <EuiModalHeaderTitle>PTL Entry - View Entry</EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>
              <>
                <table>
                  <tr>
                    <th colSpan={3} align='left'>Patient</th>
                  </tr>
                  <tr>
                    <td>Identifier:</td>
                    <td>&nbsp;&nbsp;&nbsp;</td>
                    <td>{data[rowIndex].patient.identifier}</td>
                  </tr>    
                  <tr>
                    <td>NHS Number:</td>
                    <td>&nbsp;&nbsp;&nbsp;</td>
                    <td>{data[rowIndex].patient.nhsNumber}</td>
                  </tr>                                                  
                  <tr>
                    <td>Name:</td>
                    <td>&nbsp;&nbsp;&nbsp;</td>
                    <td>{data[rowIndex].patient.firstName + ' ' + data[rowIndex].patient.lastName}</td>
                  </tr>
                  <tr>
                    <td>DOB:</td>
                    <td>&nbsp;&nbsp;&nbsp;</td>
                    <td>{data[rowIndex].patient.dob.toLocaleDateString()}</td>                  
                  </tr>
                  <tr>
                    <td>Address:</td>
                    <td>&nbsp;&nbsp;&nbsp;</td>
                    <td>{data[rowIndex].patient.address}</td>                
                  </tr>                
                </table>

                <br />

                <table>              
                  <tr>
                    <th colSpan={3} align='left'>Referral Details</th>
                  </tr>
                  <tr>
                    <td>Recieved Date:</td>
                    <td>&nbsp;&nbsp;&nbsp;</td>
                    <td>{data[rowIndex].referral.received.toLocaleDateString()}</td>                  
                  </tr>                    
                  <tr>
                    <td>Source:</td>
                    <td>&nbsp;&nbsp;&nbsp;</td>
                    <td>{data[rowIndex].referral.sourceLocal}</td>                  
                  </tr>
                  <tr>
                    <td>Specialty:</td>
                    <td>&nbsp;&nbsp;&nbsp;</td>
                    <td>General Surgery</td>                  
                  </tr> 
                  <tr>
                    <td>Treatment Function /ASI:</td>
                    <td>&nbsp;&nbsp;&nbsp;</td>
                    <td>-</td>                  
                  </tr> 
                  <tr>
                    <td>Accepting Priority:</td>
                    <td>&nbsp;&nbsp;&nbsp;</td>
                    <td>High</td>                  
                  </tr> 
                  <tr>
                    <td>Status:</td>
                    <td>&nbsp;&nbsp;&nbsp;</td>
                    <td>Referred</td>                  
                  </tr>                                                                                                                                             
                </table>

              </>
            </EuiModalBody>

            <EuiModalFooter>
              <EuiButton onClick={closeModal} fill>
                Close
              </EuiButton>
            </EuiModalFooter>
          </EuiModal>
        );
      }

      const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
      const closeFlyout = () => {
        setIsFlyoutVisible(false);
        //gridRef.current.setFocusedCell({ rowIndex/*, colIndex*/ });
      };
      const showFlyout = () => {
        closePopover();
        setIsFlyoutVisible(true);
      };

      let flyout;

      if (isFlyoutVisible) {
        flyout = (
          <EuiFlyout
            aria-labelledby="flyoutTitle"
            onClose={closeFlyout}
            ownFocus
            size="s"
          >
            <EuiFlyoutHeader hasBorder>
              <EuiTitle size="m">
                <h2 id="flyoutTitle">Update Comments - #{data[rowIndex].ptlEntryId}</h2>
              </EuiTitle>
            </EuiFlyoutHeader>

            <EuiFlyoutBody>

            <EuiForm component="form">

              <EuiFormRow label="OPD Team Comment">
                <EuiTextArea name="opd">
                  {data[rowIndex].comments.opdTeam}
                </EuiTextArea>
              </EuiFormRow>

              <EuiFormRow label="Reason For Escalation" helpText="State why this is being escalated to the divisional team">
                <EuiFieldText name="reason" />
              </EuiFormRow>

              <EuiFormRow label="Instruction Feedback From Division">
                <EuiTextArea name="feedback" />
              </EuiFormRow>

              <EuiFormRow label="Actioned By OPD Team">
                <EuiFieldText name="action" />
              </EuiFormRow>

              <EuiButton type="submit" fill>
                Update
              </EuiButton>                            

            </EuiForm>

            </EuiFlyoutBody>

            <EuiFlyoutFooter>
              <EuiButtonEmpty
                flush="left"
                iconType="cross"
                onClick={closeFlyout}
              >
                Close
              </EuiButtonEmpty>
            </EuiFlyoutFooter>
          </EuiFlyout>
        );
      }

      const actions = [
        <EuiContextMenuItem icon="inspect" key="modal" onClick={showModal}>
          View Full Details
        </EuiContextMenuItem>,
        <EuiContextMenuItem icon="pencil" key="flyout" onClick={showFlyout}>
          Update Comments
        </EuiContextMenuItem>,
      ];

      return (
        <>
          <EuiPopover
            isOpen={isPopoverVisible}
            panelPaddingSize="none"
            anchorPosition="upCenter"
            button={
              <EuiButtonIcon
                aria-label="Show actions"
                iconType="boxesHorizontal"
                color="text"
                onClick={() => setIsPopoverVisible(!isPopoverVisible)}
              />
            }
            closePopover={closePopover}
          >

          <EuiContextMenuPanel items={actions} size="s" title="Actions" />

          </EuiPopover>

          {modal}

          {flyout}
        </>
      );
    },
  },
];

const RenderCellValue = ({ rowIndex, columnId, setCellProps }: {rowIndex: number, columnId: string, setCellProps: any}) => {
  
  const data = useContext(DataContext);
  
  useEffect(() => {
    if (columnId === 'amount') {
      if (data.hasOwnProperty(rowIndex)) {
        const numeric = parseFloat(
          //data[rowIndex][columnId].match(/\d+\.\d+/)[0],
          '10'
        );
        setCellProps({
          style: {
            backgroundColor: `rgba(0, 255, 0, ${numeric * 0.0002})`,
          },
        });
      }
    }
  }, [rowIndex, columnId, setCellProps, data]);

  function getFormatted(rowIndex: number, columnId: string) {

    switch (columnId) {
      case 'ptlEntryId':
        return data[rowIndex].ptlEntryId;
        break;
      case 'patient.identifier':
        return data[rowIndex].patient.identifier;
        break;
      case 'patient':
        return data[rowIndex].patient.firstName + ' ' + data[rowIndex].patient.lastName + ' (' + data[rowIndex].patient.dob.toLocaleDateString() + ')';
        break;                  
      case 'consultantName':
        return data[rowIndex].consultantName;
        break;
      case 'referredToSpeciality':
        if(data[rowIndex].referral.toSpecialty <= 7) {
          return 'General Surgery';
        }
        else if (data[rowIndex].referral.toSpecialty < 14 && data[rowIndex].referral.toSpecialty >= 8) {
          return 'Dermatology';
        }
        else {
          return 'Oncology';
        } 
        break;
      case 'rttStatus':
        return data[rowIndex].rttStatus ? 'OK' : 'Waitlist Time Exceeded';
        break;
      case 'rttBreachDate':
        if(data[rowIndex].rttStatus){
          return '-';
        }
        else{
          return data[rowIndex].rttBreachDate.toLocaleDateString();
        }        
        break;                                     
      default:
        return data[rowIndex].ptlEntryId;
    }
  }

  return data.hasOwnProperty(rowIndex) ? getFormatted(rowIndex, columnId) : null;

};

export const EnhPtlApp = ({ basename, notifications, http, navigation }: EnhPtlAppDeps) => {

  const updateEntry = (entry: PTLEntry) => {

    alert("Updating patient: " + entry.patient.identifier);

    http.post('/api/enh_ptl/post_data').then((res) => {

    });
  }

  {/*
  // Selection
  //const [selectedItems, setSelectedItems] = useState<PTLEntry[]>([]);
  */}

  // Pagination
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const onChangeItemsPerPage = useCallback(
    (pageSize) =>
      setPagination((pagination) => ({
        ...pagination,
        pageSize,
        pageIndex: 0,
      })),
    [setPagination]
  );
  const onChangePage = useCallback(
    (pageIndex) =>
      setPagination((pagination) => ({ ...pagination, pageIndex })),
    [setPagination]
  );

  // Sorting
  const [sortingColumns, setSortingColumns] = useState([]);
  const onSort = useCallback(
    (sortingColumns) => {
      setSortingColumns(sortingColumns);
    },
    [setSortingColumns]
  );

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map(({ id }) => id) // initialize to the full set of columns
  );

  const onColumnResize = useRef((eventData: any) => {
    console.log(eventData);
  });

  {/*
  const onSelectionChange = (selectedItems: PTLEntry[]) => {
    setSelectedItems(selectedItems);
  };

  const selection: EuiTableSelectionType<PTLEntry> = {
    selectable: (entry: PTLEntry) => entry.status,
    selectableMessage: (selectable: boolean) =>
      !selectable ? 'User is currently offline' : '',
    onSelectionChange,
  };

  const deleteSelectedUsers = () => {
    deleteUsersByIds(...selectedItems.map((entry: PTLEntry) => entry.id));
    setSelectedItems([]);
  };

  const deleteButton =
    selectedItems.length > 0 ? (
      <EuiButton color="danger" iconType="trash" onClick={deleteSelectedUsers}>
        Delete {selectedItems.length} Users
      </EuiButton>
    ) : null;
  */}

  /**
   * Pagination & sorting
   */
  //const [pageIndex, setPageIndex] = useState(0);
  //const [pageSize, setPageSize] = useState(5);
  //const [sortField, setSortField] = useState<keyof PTLEntry>('patientName');
  //const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  {/*
  const onTableChange = ({ page, sort }: Criteria<PTLEntry>) => {
    if (page) {
      const { index: pageIndex, size: pageSize } = page;
      setPageIndex(pageIndex);
      setPageSize(pageSize);
    }
    if (sort) {
      const { field: sortField, direction: sortDirection } = sort;
      setSortField(sortField);
      setSortDirection(sortDirection);
    }
  };
  */}

  {/*
  // Manually handle sorting and pagination of data
  const findEntries = (
    entries: PTLEntry[],
    pageIndex: number,
    pageSize: number,
    sortField: keyof PTLEntry,
    sortDirection: 'asc' | 'desc'
  ) => {
    let items;

    //entries = getEntriesFromOpensearch();

    if (sortField) {
      items = entries
        .slice(0)
        .sort(
          Comparators.property(sortField, Comparators.default(sortDirection))
        );
    } else {
      items = entries;
    }

    let pageOfItems;

    if (!pageIndex && !pageSize) {
      pageOfItems = items;
    } else {
      const startIndex = pageIndex * pageSize;
      pageOfItems = items.slice(
        startIndex,
        Math.min(startIndex + pageSize, entries.length)
      );
    }

    return {
      pageOfItems,
      totalItemCount: entries.length,
    };
  };
  */}

  {/*
  const { pageOfItems, totalItemCount } = findEntries(
    entries,
    pageIndex,
    pageSize,
    sortField,
    sortDirection
  );
  */}

  {/*
  const pagination = {
    pageIndex: pageIndex,
    pageSize: pageSize,
    totalItemCount: totalItemCount,
    pageSizeOptions: [3, 5, 8],
  };
  */}

  {/*
  const sorting: EuiTableSortingType<PTLEntry> = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };
  */}

  return (

    <Router basename={basename}>
    <I18nProvider>
      <>
        <navigation.ui.TopNavMenu
          appName={PLUGIN_ID}
          showSearchBar={false}
          useDefaultBehaviors={true}
        />
        <EuiPage restrictWidth="95%">
          <EuiPageBody component="main">
            <EuiPageHeader>
              <EuiTitle size="m">
                <h1>
                  <FormattedMessage
                    id="enhPtl.helloWorldText"
                    defaultMessage="{name}"
                    values={{ name: PLUGIN_NAME }}
                  />
                </h1>
              </EuiTitle>
            </EuiPageHeader>
            <EuiPageContent>
              <EuiPageContentHeader>
                <EuiTitle size="s">
                  <h2>
                    <FormattedMessage
                      id="enhPtl.congratulationsTitle"
                      defaultMessage="Entries"
                    />
                  </h2>
                </EuiTitle>
              </EuiPageContentHeader>
              <EuiPageContentBody>
                {/*
                <>
                  <EuiFlexGroup alignItems="center">
                    <EuiFlexItem grow={false}>
                      <EuiSwitch
                        label="Multiple Actions"
                        checked={multiAction}
                        onChange={() => setMultiAction(!multiAction)}
                      />
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <EuiSwitch
                        label="Custom Actions"
                        checked={customAction}
                        onChange={() => setCustomAction(!customAction)}
                      />
                    </EuiFlexItem>
                    <EuiFlexItem />
                  </EuiFlexGroup>

                  <EuiSpacer size="l" />

                  {/*
                  <EuiBasicTable
                    tableCaption="PTL Entries for Maternity"
                    items={pageOfItems}
                    itemId="id"
                    columns={columnsWithActions}
                    pagination={pagination}
                    sorting={sorting}
                    selection={selection}
                    hasActions={customAction ? false : true}
                    onChange={onTableChange}
                  />                  
                </>
                */}
                  <DataContext.Provider value={entries}>
                    <EuiDataGrid
                    aria-label="Data grid demo"
                    columns={columns}
                    columnVisibility={{ visibleColumns, setVisibleColumns }}
                    trailingControlColumns={trailingControlColumns}
                    rowCount={entries.length}
                    renderCellValue={RenderCellValue}
                    inMemory={{ level: 'sorting' }}
                    sorting={{ columns: sortingColumns, onSort }}
                    pagination={{
                      ...pagination,
                      pageSizeOptions: [5, 10, 15, 20],
                      onChangeItemsPerPage: onChangeItemsPerPage,
                      onChangePage: onChangePage,
                    }}
                    onColumnResize={onColumnResize.current}
                    ref={gridRef}
                    />
                  </DataContext.Provider>
                </EuiPageContentBody>
                </EuiPageContent>
              </EuiPageBody>
            </EuiPage>
          </>
        </I18nProvider>
      </Router>
  );
};