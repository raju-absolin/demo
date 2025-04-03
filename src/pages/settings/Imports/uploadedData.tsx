
import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

// Extract text and inline styles from HTML
const extractTextAndStyle = (htmlString: string) => {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = htmlString;

  const firstChild = tempElement.firstElementChild as HTMLElement | null;

  if (firstChild) {
    return {
      text: firstChild.textContent || "",
      style: firstChild.getAttribute("style") || "",
    };
  }

  return { text: htmlString, style: "" };
};


// Convert inline CSS string to an object
const parseInlineStyle = (styleString: string) => {
  return styleString.split(";").reduce((acc: any, rule) => {
    const [key, value] = rule.split(":").map((s) => s.trim());
    if (key && value) {
      const camelCaseKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      acc[camelCaseKey] = value;
    }
    return acc;
  }, {});
};

const columns: GridColDef[] = [
  { field: "import_type", headerName: "Import Type", width: 150 },
  {
    field: "code",
    headerName: "Code",
    width: 180,
    renderCell: (params) => (
      <span style={parseInlineStyle(params.row.code_style || "")}>
        {params.value}
      </span>
    ),
  },
  {
    field: "name",
    headerName: "Name",
    width: 200,
    renderCell: (params) => (
      <span style={parseInlineStyle(params.row.name_style || "")}>
        {params.value}
      </span>
    ),
  },
  { field: "user__username", headerName: "User", width: 150 },
  { field: "createdby__username", headerName: "Created By", width: 150 },
  { field: "created_on", headerName: "Created On", width: 200 },
  { field: "modifiedby__username", headerName: "Modified By", width: 150 },
  { field: "modified_on", headerName: "Modified On", width: 200 },
];

const ValidRowsTable: React.FC = () => {
  const [validRows, setValidRows] = useState<any[]>([]);

  useEffect(() => {
    const apiResponse = {
      message: {
        valid_rows: [
          {
            import_type: "new",
            id: `<ins style="background:#e6ffe6;">9891</ins>`,
            code: `<ins style="background:#e6ffe6;">DEV09889</ins>`,
            name: `<ins style="color: red;">Device A</ins>`,
            user__username: "Admin",
            createdby__username: "System",
            modifiedby__username: "User123",
          },
        ],
      },
      status: true,
    };

    const formattedRows = apiResponse.message.valid_rows.map((row) => {
      const { text: codeText, style: codeStyle } = extractTextAndStyle(row.code);
      const { text: nameText, style: nameStyle } = extractTextAndStyle(row.name);

      return {
        id: extractTextAndStyle(row.id).text,
        import_type: row.import_type,
        code: codeText,
        code_style: codeStyle,
        name: nameText,
        name_style: nameStyle,
        user__username: row.user__username || "-",
        createdby__username: row.createdby__username || "-",
        modifiedby__username: row.modifiedby__username || "-",
        created_on: new Date().toISOString().split("T")[0],
        modified_on: new Date().toISOString().split("T")[0],
      };
    });

    setValidRows(formattedRows);
  }, []);

  return (
    <Box sx={{ height: 400, width: "100%", padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Valid Imported Rows
      </Typography>
      <DataGrid
        rows={validRows}
        columns={columns}
        getRowId={(row) => row.id}
        pageSizeOptions={[5, 10, 25]}
      />
    </Box>
  );
};

export default ValidRowsTable;
